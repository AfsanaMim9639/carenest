"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  Phone, Mail, User, FileText, CheckCircle,
  DollarSign, CreditCard
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = parseInt(params.service_id);

  // Service data with hourly rates
  const serviceRates = {
    1: { name: "Professional Baby Care", rate: 500, category: "Baby Care" },
    2: { name: "Newborn Care Specialist", rate: 700, category: "Baby Care" },
    3: { name: "After School Care", rate: 450, category: "Baby Care" },
    4: { name: "Special Needs Child Care", rate: 800, category: "Baby Care" },
    5: { name: "Weekend Babysitting", rate: 550, category: "Baby Care" },
    6: { name: "Senior Companion Care", rate: 600, category: "Elderly Care" },
    7: { name: "Dementia & Alzheimer's Care", rate: 750, category: "Elderly Care" },
    8: { name: "Post-Hospitalization Care", rate: 700, category: "Elderly Care" },
    9: { name: "Respite Care for Family", rate: 650, category: "Elderly Care" },
    10: { name: "24/7 Live-in Care", rate: 12000, category: "Elderly Care", unit: "day" },
    11: { name: "Nursing Care at Home", rate: 900, category: "Special Care" },
    12: { name: "Chronic Disease Management", rate: 850, category: "Special Care" },
    13: { name: "Physiotherapy Support", rate: 700, category: "Special Care" },
    14: { name: "Palliative & Hospice Care", rate: 1000, category: "Special Care" }
  };

  const service = serviceRates[serviceId];

  // Bangladesh divisions and districts
  const locations = {
    "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Narsingdi", "Rajbari", "Faridpur", "Gopalganj", "Madaripur", "Shariatpur"],
    "Chittagong": ["Chittagong", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachari", "Feni", "Lakshmipur", "Comilla", "Noakhali", "Brahmanbaria", "Chandpur"],
    "Rajshahi": ["Rajshahi", "Natore", "Naogaon", "Pabna", "Sirajganj", "Bogra", "Joypurhat", "Chapainawabganj"],
    "Khulna": ["Khulna", "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
    "Barisal": ["Barisal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
    "Sylhet": ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
    "Rangpur": ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
    "Mymensingh": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    durationType: service?.unit === "day" ? "days" : "hours",
    duration: service?.unit === "day" ? 7 : 4,
    division: "",
    district: "",
    city: "",
    area: "",
    address: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  // Calculate total cost dynamically
  useEffect(() => {
    if (service) {
      const duration = parseInt(formData.duration) || 0;
      const rate = service.rate;
      
      if (formData.durationType === "days") {
        if (service.unit === "day") {
          setTotalCost(rate * duration);
        } else {
          setTotalCost(rate * duration * 24);
        }
      } else {
        setTotalCost(rate * duration);
      }
    }
  }, [formData.duration, formData.durationType, service]);

  // Restore pending booking data after login
  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const data = JSON.parse(pendingBooking);
        if (data.serviceId === serviceId) {
          setFormData(data.formData);
          setTotalCost(data.totalCost);
          toast.info("Your booking details have been restored", {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error restoring booking:", error);
      }
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "division" ? { district: "", city: "", area: "" } : {})
    }));
  };

  // Check if user is logged in
  const checkAuth = async () => {
    try {
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      
      if (!sessionData?.user) {
        toast.error("Please login to complete your booking", {
          duration: 4000,
          icon: "🔒",
        });
        localStorage.setItem('pendingBooking', JSON.stringify({
          serviceId,
          serviceName: service.name,
          category: service.category,
          formData,
          totalCost
        }));
        router.push(`/login?callbackUrl=/booking/${serviceId}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Session check error:", error);
      return false;
    }
  };

  // Handle booking without payment (existing)
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;

  setIsSubmitting(true);

  const bookingData = {
    serviceId,
    serviceName: service.name,
    category: service.category,
    serviceIcon: "🏥",
    serviceType: "baby-care",
    serviceRate: service.rate,
    ...formData,
    totalCost,
    status: "pending",
    bookingDate: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create booking');
    }

    localStorage.removeItem('pendingBooking');
    
    // ✅ Remove toast, directly redirect
    router.push(`/booking-success?id=${data.booking.id}`);

  } catch (error) {
    console.error("Booking error:", error);
    toast.error(error.message || "Failed to create booking", {
      duration: 4000,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle payment checkout (new)
  const handlePayNow = async (e) => {
    e.preventDefault();
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    setIsProcessingPayment(true);

    const bookingData = {
      serviceId,
      serviceName: service.name,
      category: service.category,
      serviceIcon: "🏥",
      serviceType: "baby-care",
      serviceRate: service.rate,
      ...formData,
      totalCost,
    };

    try {
      // Encode booking data for checkout page
      const encodedData = encodeURIComponent(JSON.stringify(bookingData));
      
      localStorage.removeItem('pendingBooking');
      
      // Redirect to checkout page
      router.push(`/checkout?data=${encodedData}`);
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment", {
        duration: 4000,
      });
      setIsProcessingPayment(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/services">
            <button className="glass-button px-6 py-3">View All Services</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href={`/service/${serviceId}`}>
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button mt-10 mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Book Your Service
          </h1>
          <p className="text-xl text-white/70 mb-2">{service.name}</p>
          <p className="text-white/60">
            {service.category} • ৳{service.rate}/{service.unit || "hour"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-theme-50" />
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition"
                      placeholder="01XXX-XXXXXX"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-white/70 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Duration Selection */}
              <div className="pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-theme-50" />
                  Select Duration
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-2">
                      Duration Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="durationType"
                      required
                      value={formData.durationType}
                      onChange={handleChange}
                      disabled={service.unit === "day"}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-theme-100 focus:outline-none transition disabled:opacity-50 [&>option]:bg-gray-900 [&>option]:text-white"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">
                      Number of {formData.durationType} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-theme-100 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Location Selection */}
              <div className="pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-theme-50" />
                  Service Location
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-2">
                      Division <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="division"
                      required
                      value={formData.division}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-theme-100 focus:outline-none transition [&>option]:bg-gray-900 [&>option]:text-white"
                    >
                      <option value="">Select Division</option>
                      {Object.keys(locations).map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">
                      District <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.division}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-theme-100 focus:outline-none transition disabled:opacity-50 [&>option]:bg-gray-900 [&>option]:text-white"
                    >
                      <option value="">Select District</option>
                      {formData.division && locations[formData.division]?.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">
                      City/Upazila <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition"
                      placeholder="Enter city/upazila"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-2">
                      Area <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      required
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition"
                      placeholder="Enter area name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-white/70 mb-2">
                    Full Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition resize-none"
                    placeholder="House/flat number, road, block..."
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-theme-50" />
                  Additional Information
                </h2>

                <div>
                  <label className="block text-white/70 mb-2">
                    Special Requirements or Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-theme-100 focus:outline-none transition resize-none"
                    placeholder="Any specific requirements, medical conditions, or special instructions..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                {/* Confirm Booking (Pay Later) */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isProcessingPayment}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full py-4 rounded-lg border-2 border-theme-100 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Confirm Booking (Pay Later)
                    </>
                  )}
                </motion.button>

                {/* Pay Now */}
                <motion.button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isSubmitting || isProcessingPayment}
                  whileHover={{ scale: isProcessingPayment ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessingPayment ? 1 : 0.98 }}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-theme-900 border-t-transparent rounded-full"
                      />
                      Redirecting...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 inline mr-2" />
                      Pay Now
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-white/60 text-sm text-center mt-4">
                Choose "Confirm Booking" to book now and pay later, or "Pay Now" to complete payment immediately
              </p>
            </form>
          </motion.div>

          {/* Cost Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 h-fit sticky top-24"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-theme-50" />
              Cost Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/70">
                <span>Service Rate:</span>
                <span>৳{service.rate}/{service.unit || "hr"}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Duration:</span>
                <span>{formData.duration} {formData.durationType}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-bold">Total Cost:</span>
                <span className="text-2xl font-bold gradient-text">
                  ৳{totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="glass-subtle p-4 rounded-lg mb-4">
              <p className="text-white/60 text-xs leading-relaxed">
                <strong className="text-white">Note:</strong> You can choose to pay now or after service confirmation. Our team will contact you to finalize the schedule.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Verified Caregivers</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Flexible Scheduling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
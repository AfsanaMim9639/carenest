'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Home,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookingId = searchParams.get('id');
  const paymentIntent = searchParams.get('paymentIntent');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Removed toast - just redirect if no data
    if (!bookingId && !paymentIntent) {
      setTimeout(() => router.push('/'), 1000);
      return;
    }

    // ✅ Removed toast - page animation shows success
    fetchBookingDetails();
  }, [bookingId, paymentIntent]);

  const fetchBookingDetails = async () => {
    try {
      let response;
      
      if (paymentIntent) {
        response = await fetch(`/api/bookings/by-payment-intent?paymentIntent=${paymentIntent}`);
      } 
      else if (bookingId) {
        response = await fetch(`/api/bookings/${bookingId}`);
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setBooking(data.booking);
      } else {
        // ✅ Removed toast - just redirect on error
        setTimeout(() => router.push('/'), 1000);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      // ✅ Removed toast - just redirect on error
      setTimeout(() => router.push('/'), 1000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-400 mx-auto mb-4"></div>
          <p className="text-theme-200">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-theme-200 mb-4">Booking not found</p>
          <Link href="/">
            <button className="glass-button px-6 py-3">Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black py-12 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-theme-300/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
      </div>

      <div className="relative z-10 mt-10 max-w-4xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50"
          >
            <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold gradient-text mb-4"
          >
            Booking Confirmed! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-theme-200 mb-2"
          >
            Your booking has been successfully created!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block glass-subtle px-4 py-2 rounded-full"
          >
            <span className="text-theme-200 text-sm">
              Booking ID: <span className="font-mono font-bold text-white">{booking.displayId}</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Service Details */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Service Details</h2>
            <div className="space-y-3">
              <DetailItem 
                icon={<Calendar size={18} />}
                label="Service"
                value={booking.serviceName}
              />
              <DetailItem 
                icon={<Clock size={18} />}
                label="Duration"
                value={`${booking.duration} ${booking.durationType}`}
              />
              <DetailItem 
                icon={<Calendar size={18} />}
                label="Booked On"
                value={new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contact & Location</h2>
            <div className="space-y-3">
              <DetailItem 
                icon={<Phone size={18} />}
                label="Phone"
                value={booking.phone}
              />
              {booking.email && (
                <DetailItem 
                  icon={<Mail size={18} />}
                  label="Email"
                  value={booking.email}
                />
              )}
              <DetailItem 
                icon={<MapPin size={18} />}
                label="Location"
                value={booking.location || `${booking.area}, ${booking.city}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Payment Summary</h2>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-theme-200">Service Cost</span>
            <span className="text-white font-medium">৳{booking.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-theme-200">Payment Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.paymentStatus === 'paid' 
                ? 'bg-green-500/20 text-green-300'
                : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              {booking.paymentStatus || 'pending'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <span className="text-theme-200">Booking Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'confirmed' 
                ? 'bg-green-500/20 text-green-300'
                : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center justify-between py-4 mt-2">
            <span className="text-lg font-bold text-white">Total Amount</span>
            <span className="text-2xl font-bold gradient-text">
              ৳{booking.totalCost.toLocaleString()}
            </span>
          </div>
          
          {booking.paymentStatus === 'paid' ? (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                Payment completed successfully
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                Payment can be made after service confirmation
              </p>
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">What's Next?</h2>
          <div className="space-y-3 text-theme-200">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-theme-400 text-white text-sm flex items-center justify-center font-bold">1</span>
              <p>Our team will contact you within 1 hour to confirm the schedule and caregiver details.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-theme-400 text-white text-sm flex items-center justify-center font-bold">2</span>
              <p>You'll receive the caregiver's profile and verification documents via phone/email.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-theme-400 text-white text-sm flex items-center justify-center font-bold">3</span>
              <p>The service will begin at your scheduled time. Our support team is available 24/7 for any assistance.</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link href="/services" className="block">
            <button className="w-full glass-button flex items-center justify-center gap-2 py-4">
              <Calendar size={20} />
              Browse More Services
            </button>
          </Link>
          
          <Link href="/" className="block">
            <button className="w-full bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold rounded-lg flex items-center justify-center gap-2 py-4 hover:shadow-lg hover:shadow-theme-100/50 transition-all">
              <Home size={20} />
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-theme-300 mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-theme-300 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Baby, Heart, Activity, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AllServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dummy data as fallback
  const dummyServices = [
    // Baby Care (1-5)
    { id: 1, category: "Baby Care", icon: Baby, title: "Professional Baby Care", desc: "Certified babysitters for infants and toddlers", price: "৳500/hr", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop" },
    { id: 2, category: "Baby Care", icon: Baby, title: "Newborn Care Specialist", desc: "Expert care for newborns 0-3 months", price: "৳700/hr", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop" },
    { id: 3, category: "Baby Care", icon: Baby, title: "After School Care", desc: "Care for school-age children", price: "৳450/hr", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop" },
    { id: 4, category: "Baby Care", icon: Baby, title: "Special Needs Child Care", desc: "Specialized care for special needs", price: "৳800/hr", image: "https://images.unsplash.com/photo-1612924623499-7aaef4ecd1bb?w=400&h=300&fit=crop" },
    { id: 5, category: "Baby Care", icon: Baby, title: "Weekend Babysitting", desc: "Flexible weekend childcare", price: "৳550/hr", image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop" },
    
    // Elderly Care (6-10)
    { id: 6, category: "Elderly Care", icon: Heart, title: "Senior Companion Care", desc: "Companionship and daily assistance", price: "৳600/hr", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop" },
    { id: 7, category: "Elderly Care", icon: Heart, title: "Dementia & Alzheimer's Care", desc: "Specialized memory care", price: "৳750/hr", image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop" },
    { id: 8, category: "Elderly Care", icon: Heart, title: "Post-Hospitalization Care", desc: "Recovery support after discharge", price: "৳700/hr", image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=300&fit=crop" },
    { id: 9, category: "Elderly Care", icon: Heart, title: "Respite Care for Family", desc: "Relief for family caregivers", price: "৳650/hr", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop" },
    { id: 10, category: "Elderly Care", icon: Heart, title: "24/7 Live-in Care", desc: "Round-the-clock senior care", price: "৳12k/day", image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=400&h=300&fit=crop" },
    
    // Medical/Special Care (11-14)
    { id: 11, category: "Special Care", icon: Activity, title: "Nursing Care at Home", desc: "Professional nursing services", price: "৳900/hr", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop" },
    { id: 12, category: "Special Care", icon: Stethoscope, title: "Chronic Disease Management", desc: "Long-term illness support", price: "৳850/hr", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop" },
    { id: 13, category: "Special Care", icon: Activity, title: "Physiotherapy Support", desc: "Physical therapy assistance", price: "৳700/hr", image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop" },
    { id: 14, category: "Special Care", icon: Activity, title: "Palliative & Hospice Care", desc: "Comfort care for serious illness", price: "৳1000/hr", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop" },
  ];

  const categories = ["All", "Baby Care", "Elderly Care", "Special Care"];

  // Fetch services from MongoDB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          
          // Transform MongoDB data to match dummy data structure
          const transformedData = data.services.map((service) => ({
            id: service.serviceId,
            category: service.category,
            icon: getIconByCategory(service.category),
            title: service.name,
            desc: service.description.substring(0, 100) + "...",
            price: `৳${service.rate}/${service.unit}`,
            image: service.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
            isActive: service.isActive,
          }));

          // Filter only active services
          const activeServices = transformedData.filter(s => s.isActive);

          // Combine dummy data with MongoDB data
          // Remove duplicates based on ID, MongoDB data takes precedence
          const dbIds = activeServices.map(s => s.id);
          const uniqueDummy = dummyServices.filter(s => !dbIds.includes(s.id));
          
          setServices([...activeServices, ...uniqueDummy]);
        } else {
          // If API fails, use dummy data
          setServices(dummyServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Use dummy data on error
        setServices(dummyServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Helper function to get icon by category
  const getIconByCategory = (category) => {
    switch (category) {
      case "Baby Care":
        return Baby;
      case "Elderly Care":
        return Heart;
      case "Special Care":
        return Activity;
      default:
        return Stethoscope;
    }
  };

  const filteredServices = selectedCategory === "All" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-6xl font-bold gradient-text mb-4 mt-10">
            All Our Services
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive care solutions for every family member
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900'
                  : 'glass-button'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-semibold text-xs">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:gradient-text transition-all">
                      {service.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{service.desc}</p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-lg font-bold gradient-text">{service.price}</span>
                      <Link href={`/service/${service.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1, x: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-theme-50 to-theme-100 flex items-center justify-center shadow-lg"
                          title="View Details"
                        >
                          <ArrowRight className="w-5 h-5 text-theme-900" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Services Found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
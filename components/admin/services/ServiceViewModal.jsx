// components/admin/services/ServiceViewModal.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, DollarSign, CheckCircle, Info, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ServiceViewModal({ service, isOpen, onClose }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const items = contentRef.current.querySelectorAll(".detail-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [isOpen]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0b4345] to-[#2b6f7a] px-8 py-6 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Service Details
                  </h2>
                  <p className="text-gray-300 font-mono">
                    ID: #{service.serviceId}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div ref={contentRef} className="p-8 space-y-6">
                {/* Status Badge */}
                <div className="detail-item flex items-center gap-4">
                  <span
                    className={`px-6 py-2 rounded-full text-sm font-bold border-2 ${
                      service.isActive
                        ? "bg-green-500/20 text-green-300 border-green-500/50"
                        : "bg-red-500/20 text-red-300 border-red-500/50"
                    }`}
                  >
                    {service.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                  <span className="px-6 py-2 rounded-full text-sm font-bold border-2 bg-[#a3c4e0]/20 text-[#a3c4e0] border-[#a3c4e0]/50">
                    {service.category}
                  </span>
                </div>

                {/* Service Image */}
                {service.image && service.image !== '/images/services/default.jpg' && (
                  <div className="detail-item glass-card p-4">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Basic Info */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-6 h-6 text-[#a3c4e0]" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Service Name</p>
                      <p className="text-white font-semibold text-lg">
                        {service.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Category</p>
                      <p className="text-white font-semibold">{service.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Rate</p>
                      <p className="text-[#a3c4e0] font-bold text-xl flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        ৳{service.rate}
                        <span className="text-gray-400 text-sm font-normal">
                          /{service.unit}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Popularity Score</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p className="text-white font-semibold">
                          {service.popularity}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6 text-[#7aabb8]" />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="detail-item glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-[#4d8a9b]" />
                      Features & Benefits
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {service.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 glass-subtle p-3 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-white">{feature}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="detail-item glass-card p-6 bg-white/5">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Created On</p>
                      <p className="text-gray-300 font-semibold">
                        {new Date(service.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {service.updatedAt && (
                      <div>
                        <p className="text-gray-400">Last Updated</p>
                        <p className="text-gray-300 font-semibold">
                          {new Date(service.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
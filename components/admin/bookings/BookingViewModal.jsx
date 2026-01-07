// components/admin/bookings/BookingViewModal.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Calendar, MapPin, Clock, DollarSign, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BookingViewModal({ booking, isOpen, onClose }) {
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

  if (!booking) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0b4345] to-[#2b6f7a] px-8 py-6 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Booking Details
                  </h2>
                  <p className="text-gray-300 font-mono">
                    ID: #{booking._id.slice(-8).toUpperCase()}
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
                    className={`px-6 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                  {booking.paymentStatus && (
                    <span className="px-6 py-2 rounded-full text-sm font-bold border-2 bg-purple-500/20 text-purple-300 border-purple-500/50">
                      Payment: {booking.paymentStatus.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Service Information */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-3xl">{booking.serviceIcon}</span>
                    Service Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Service Name</p>
                      <p className="text-white font-semibold">{booking.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Category</p>
                      <p className="text-white font-semibold">{booking.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Duration</p>
                      <p className="text-white font-semibold">
                        {booking.duration} {booking.durationType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Service Rate</p>
                      <p className="text-[#a3c4e0] font-bold text-lg">
                        ৳{booking.serviceRate.toLocaleString()}/{booking.durationType.slice(0, -1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white font-semibold">{booking.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white font-semibold">{booking.phone}</p>
                      </div>
                    </div>
                    {booking.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white font-semibold">{booking.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Schedule
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Date</p>
                        <p className="text-white font-semibold">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Start Time</p>
                        <p className="text-white font-semibold">{booking.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">End Time</p>
                        <p className="text-white font-semibold">{booking.endTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Location
                  </h3>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Division</p>
                        <p className="text-white font-semibold">{booking.division}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">District</p>
                        <p className="text-white font-semibold">{booking.district}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">City</p>
                        <p className="text-white font-semibold">{booking.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Area</p>
                        <p className="text-white font-semibold">{booking.area}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Full Address</p>
                      <p className="text-white font-semibold">{booking.address}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="detail-item glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Payment Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                      <p className="text-white font-semibold capitalize">
                        {booking.paymentMethod || "Card"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Cost</p>
                      <p className="text-[#a3c4e0] font-bold text-2xl">
                        ৳{booking.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caregiver Information */}
                {booking.caregiverName && (
                  <div className="detail-item glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Assigned Caregiver
                    </h3>
                    <p className="text-white font-semibold text-lg">
                      {booking.caregiverName}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {(booking.notes || booking.specialRequirements) && (
                  <div className="detail-item glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Notes & Requirements
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {booking.notes || booking.specialRequirements}
                    </p>
                  </div>
                )}

                {/* Cancellation Info */}
                {booking.status === "cancelled" && booking.cancellationReason && (
                  <div className="detail-item glass-card p-6 border-2 border-red-500/30">
                    <h3 className="text-xl font-bold text-red-400 mb-4">
                      Cancellation Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="font-semibold">Reason:</span>{" "}
                        {booking.cancellationReason}
                      </p>
                      {booking.cancelledAt && (
                        <p className="text-gray-400 text-sm">
                          Cancelled on:{" "}
                          {new Date(booking.cancelledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="detail-item glass-card p-6 bg-white/5">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Booking Created</p>
                      <p className="text-gray-300 font-semibold">
                        {new Date(booking.createdAt || booking.bookingDate).toLocaleString()}
                      </p>
                    </div>
                    {booking.updatedAt && (
                      <div>
                        <p className="text-gray-400">Last Updated</p>
                        <p className="text-gray-300 font-semibold">
                          {new Date(booking.updatedAt).toLocaleString()}
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
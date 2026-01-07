// components/admin/bookings/BookingTable.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Edit, Trash2, Calendar, MapPin, DollarSign } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BookingTable({
  bookings,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (!loading && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr");
      gsap.fromTo(
        rows,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [bookings, loading]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
        <p className="text-gray-400">Try adjusting your filters</p>
      </motion.div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Booking ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Service
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Total Cost
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {bookings.map((booking) => (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm">
                    <span className="font-mono text-[#a3c4e0]">
                      #{booking._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{booking.name}</div>
                      <div className="text-gray-400 text-sm">{booking.phone}</div>
                      {booking.email && (
                        <div className="text-gray-500 text-xs">{booking.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{booking.serviceIcon}</span>
                      <div>
                        <div className="text-white font-medium">
                          {booking.serviceName}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {booking.duration} {booking.durationType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div className="text-sm">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <div className="text-sm max-w-[200px] truncate">
                        {booking.location || `${booking.area}, ${booking.city}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#a3c4e0] font-bold">
                      <DollarSign className="w-4 h-4" />
                      ৳{booking.totalCost.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(booking)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(booking)}
                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                        title="Edit Booking"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(booking)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
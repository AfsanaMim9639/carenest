"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Clock, DollarSign, 
  CheckCircle, XCircle, AlertCircle, Loader,
  Filter, Search, Eye, Trash2, MoreVertical, AlertTriangle
} from "lucide-react";

export default function MyBookings() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [bookingsList, setBookingsList] = useState([
    {
      id: 1,
      serviceName: "Baby Care",
      serviceIcon: "👶",
      duration: "4 hours",
      date: "2024-01-15",
      time: "10:00 AM - 2:00 PM",
      location: "Gulshan-2, Dhaka",
      totalCost: 2000,
      status: "confirmed",
      caregiverName: "Sara Rahman",
      bookedOn: "2024-01-10"
    },
    {
      id: 2,
      serviceName: "Elderly Care",
      serviceIcon: "👴",
      duration: "8 hours",
      date: "2024-01-20",
      time: "9:00 AM - 5:00 PM",
      location: "Banani, Dhaka",
      totalCost: 4800,
      status: "pending",
      caregiverName: "Pending Assignment",
      bookedOn: "2024-01-12"
    },
    {
      id: 3,
      serviceName: "Special Care",
      serviceIcon: "🏥",
      duration: "6 hours",
      date: "2024-01-05",
      time: "2:00 PM - 8:00 PM",
      location: "Dhanmondi, Dhaka",
      totalCost: 4800,
      status: "completed",
      caregiverName: "Dr. Kamal Hossain",
      bookedOn: "2024-01-01"
    },
    {
      id: 4,
      serviceName: "Baby Care",
      serviceIcon: "👶",
      duration: "3 hours",
      date: "2024-01-08",
      time: "3:00 PM - 6:00 PM",
      location: "Uttara, Dhaka",
      totalCost: 1500,
      status: "cancelled",
      caregiverName: "N/A",
      bookedOn: "2024-01-05"
    }
  ]);

  const handleDeleteBooking = (bookingId) => {
    setBookingsList(bookingsList.filter(b => b.id !== bookingId));
    setShowDeleteConfirm(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: AlertCircle,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.3)"
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.3)"
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)"
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)"
    }
  };

  const filteredBookings = bookingsList.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap"
        style={{ 
          color: config.color,
          backgroundColor: config.bgColor,
          borderColor: config.borderColor
        }}
      >
        <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
        <span className="hidden xs:inline">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="container mx-auto max-w-7xl mt-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
              style={{
                backgroundImage: 'linear-gradient(to right, #a3c4e0, #7aabb8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            My Bookings
          </h1>
          <p className="text-sm sm:text-base text-white/70">Manage and track all your care service bookings</p>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by service or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm sm:text-base text-white placeholder-white/40 focus:border-[#7aabb8] focus:outline-none transition"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(status)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    filter === status
                      ? "text-white border border-white/20"
                      : "text-white/60 border border-white/10 hover:text-white hover:border-white/20"
                  }`}
                  style={filter === status ? { background: 'linear-gradient(to right, #7aabb8, #4d8a9b)' } : {}}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 hover:border-white/20 transition-all group"
                >
                  <div className="flex flex-col gap-4">
                    
                    {/* Header: Icon, Title, Status */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0"
                        style={{ background: 'linear-gradient(to bottom right, #a3c4e0, #7aabb8)' }}
                      >
                        {booking.serviceIcon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base sm:text-xl font-bold text-white line-clamp-1">
                            {booking.serviceName}
                          </h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-xs sm:text-sm text-white/60">
                          Booked on {new Date(booking.bookedOn).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3c4e0] flex-shrink-0" />
                        <span className="truncate">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3c4e0] flex-shrink-0" />
                        <span className="truncate">{booking.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3c4e0] flex-shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3c4e0] flex-shrink-0" />
                        <span className="truncate">{booking.duration}</span>
                      </div>
                    </div>

                    {/* Caregiver */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm pt-2 border-t border-white/10">
                      <span className="text-white/60">Caregiver:</span>
                      <span className="text-white font-medium truncate">{booking.caregiverName}</span>
                    </div>

                    {/* Footer: Cost & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/60 mb-0.5">Total Cost</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold"
                           style={{
                             backgroundImage: 'linear-gradient(to right, #a3c4e0, #7aabb8)',
                             WebkitBackgroundClip: 'text',
                             WebkitTextFillColor: 'transparent',
                             backgroundClip: 'text'
                           }}>
                          ৳{booking.totalCost}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        
                        {booking.status === "pending" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDeleteConfirm(booking)}
                            className="p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-red-400 hover:text-red-300 hover:border-red-400/30 transition-all"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ background: 'linear-gradient(to bottom right, #a3c4e0, #7aabb8)' }}>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No bookings found</h3>
                <p className="text-sm sm:text-base text-white/60 mb-6 px-4">
                  {searchQuery || filter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "You haven't made any bookings yet"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-semibold"
                  style={{ background: 'linear-gradient(to right, #7aabb8, #4d8a9b)' }}
                  onClick={() => window.location.href = '/services'}
                >
                  Browse Services
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBooking(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              >
                <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-lg my-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Booking Details</h3>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-white/10">
                      <div 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0"
                        style={{ background: 'linear-gradient(to bottom right, #a3c4e0, #7aabb8)' }}
                      >
                        {selectedBooking.serviceIcon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1">{selectedBooking.serviceName}</h4>
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:gap-3">
                      <div className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-white/60">Booking ID</span>
                        <span className="text-white font-medium">#{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-white/60">Date</span>
                        <span className="text-white font-medium">
                          {new Date(selectedBooking.date).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-white/60">Time</span>
                        <span className="text-white font-medium">{selectedBooking.time}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-white/60">Duration</span>
                        <span className="text-white font-medium">{selectedBooking.duration}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm sm:text-base gap-4">
                        <span className="text-white/60 flex-shrink-0">Location</span>
                        <span className="text-white font-medium text-right">{selectedBooking.location}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm sm:text-base">
                        <span className="text-white/60">Caregiver</span>
                        <span className="text-white font-medium">{selectedBooking.caregiverName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-white/10 pt-4">
                        <span className="text-white font-semibold text-sm sm:text-base">Total Cost</span>
                        <span className="text-xl sm:text-2xl font-bold"
                              style={{
                                backgroundImage: 'linear-gradient(to right, #a3c4e0, #7aabb8)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>
                          ৳{selectedBooking.totalCost}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3 pt-4">
                      {selectedBooking.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-semibold bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all"
                        >
                          Cancel Booking
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBooking(null)}
                        className="flex-1 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-semibold"
                        style={{ background: 'linear-gradient(to right, #7aabb8, #4d8a9b)' }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
// components/admin/bookings/BookingEditModal.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function BookingEditModal({ booking, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: "",
    caregiverName: "",
    paymentStatus: "",
    paymentMethod: "",
    notes: "",
    cancellationReason: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        status: booking.status || "",
        caregiverName: booking.caregiverName || "",
        paymentStatus: booking.paymentStatus || "",
        paymentMethod: booking.paymentMethod || "",
        notes: booking.notes || "",
        cancellationReason: booking.cancellationReason || "",
      });
    }
  }, [booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(booking._id, formData);
      toast.success("Booking updated successfully!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update booking. Please try again.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

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
              className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0b4345] to-[#2b6f7a] px-8 py-6 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Edit Booking
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Booking Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="glass-input w-full"
                    required
                  >
                    <option value="pending" className="bg-[#081e28]">
                      Pending
                    </option>
                    <option value="confirmed" className="bg-[#081e28]">
                      Confirmed
                    </option>
                    <option value="completed" className="bg-[#081e28]">
                      Completed
                    </option>
                    <option value="cancelled" className="bg-[#081e28]">
                      Cancelled
                    </option>
                  </select>
                </div>

                {/* Caregiver Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Assigned Caregiver
                  </label>
                  <input
                    type="text"
                    value={formData.caregiverName}
                    onChange={(e) =>
                      setFormData({ ...formData, caregiverName: e.target.value })
                    }
                    placeholder="Enter caregiver name"
                    className="glass-input w-full"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }
                    className="glass-input w-full"
                    required
                  >
                    <option value="pending" className="bg-[#081e28]">
                      Pending
                    </option>
                    <option value="paid" className="bg-[#081e28]">
                      Paid
                    </option>
                    <option value="refunded" className="bg-[#081e28]">
                      Refunded
                    </option>
                    <option value="failed" className="bg-[#081e28]">
                      Failed
                    </option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="glass-input w-full"
                    required
                  >
                    <option value="card" className="bg-[#081e28]">
                      Card
                    </option>
                    <option value="cash" className="bg-[#081e28]">
                      Cash
                    </option>
                    <option value="mobile banking" className="bg-[#081e28]">
                      Mobile Banking
                    </option>
                    <option value="bank transfer" className="bg-[#081e28]">
                      Bank Transfer
                    </option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any notes or special instructions..."
                    rows={4}
                    className="glass-input w-full resize-none"
                  />
                </div>

                {/* Cancellation Reason (shown only if status is cancelled) */}
                {formData.status === "cancelled" && (
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Cancellation Reason
                    </label>
                    <textarea
                      value={formData.cancellationReason}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cancellationReason: e.target.value,
                        })
                      }
                      placeholder="Enter cancellation reason..."
                      rows={3}
                      className="glass-input w-full resize-none"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="glass-button px-8 py-3 bg-gradient-to-r from-[#a3c4e0] to-[#4d8a9b] text-white font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
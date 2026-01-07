// components/admin/services/ServiceDeleteModal.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ServiceDeleteModal({ service, isOpen, onClose, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(service._id);
      toast.success("Service deleted successfully!", {
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
      console.error("Delete error:", error);
      toast.error("Failed to delete service. Please try again.", {
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
              className="glass-strong w-full max-w-md rounded-2xl border-2 border-red-500/30"
            >
              <div className="bg-gradient-to-r from-red-900/50 to-red-700/50 px-8 py-6 flex items-center justify-between border-b border-red-500/30 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-500/20">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Delete Service
                  </h2>
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

              <div className="p-8 space-y-6">
                <div className="glass-card p-6 bg-red-500/10 border border-red-500/30">
                  <p className="text-white text-lg leading-relaxed">
                    Are you sure you want to delete this service? This action{" "}
                    <span className="font-bold text-red-400">cannot be undone</span>.
                  </p>
                </div>

                <div className="glass-card p-6 space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Service ID</p>
                    <p className="text-white font-mono font-bold">
                      #{service.serviceId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Service Name</p>
                    <p className="text-white font-semibold">{service.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-semibold">{service.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Rate</p>
                    <p className="text-[#a3c4e0] font-bold text-lg">
                      ৳{service.rate}/{service.unit}
                    </p>
                  </div>
                </div>

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
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-bold flex items-center gap-2 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Delete Service
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
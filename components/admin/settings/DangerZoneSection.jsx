// components/admin/settings/DangerZoneSection.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, LogOut, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DangerZoneSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm', {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
      return;
    }

    setLoading(true);
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Account deleted successfully", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast.error("Failed to delete account", {
        duration: 3000,
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

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Logged out successfully!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      toast.error("Failed to logout", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 border-2 border-red-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-400">Danger Zone</h2>
            <p className="text-gray-400 text-sm">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Logout */}
          <div className="glass-subtle p-4 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-yellow-400" />
                  Logout from Account
                </h3>
                <p className="text-gray-400 text-sm">
                  Sign out from your current session
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors whitespace-nowrap"
              >
                Logout
              </motion.button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="glass-subtle p-4 border border-red-500/30 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  Delete Account
                </h3>
                <p className="text-gray-400 text-sm">
                  Permanently delete your account and all data. This action cannot
                  be undone.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors whitespace-nowrap"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="glass-strong w-full max-w-md rounded-2xl border-2 border-red-500/50"
              >
                <div className="bg-gradient-to-r from-red-900/50 to-red-700/50 px-8 py-6 flex items-center justify-between border-b border-red-500/30 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-red-500/20">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Delete Account
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="glass-card p-6 bg-red-500/10 border border-red-500/30">
                    <p className="text-white text-lg leading-relaxed">
                      This action is{" "}
                      <span className="font-bold text-red-400">
                        permanent and irreversible
                      </span>
                      . All your data will be deleted permanently.
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Type{" "}
                      <span className="text-red-400 font-mono">DELETE</span> to
                      confirm
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="glass-input w-full"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteModal(false)}
                      className="px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteAccount}
                      disabled={loading || confirmText !== "DELETE"}
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
                          Delete Forever
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
    </>
  );
}
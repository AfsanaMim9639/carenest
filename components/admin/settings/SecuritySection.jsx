// components/admin/settings/SecuritySection.jsx
"use client";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SecuritySection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!", {
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

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!", {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password changed successfully!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password", {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[#7aabb8]/20">
          <Shield className="w-6 h-6 text-[#7aabb8]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          <p className="text-gray-400 text-sm">Manage your password and security</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7aabb8]" />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="glass-input w-full pr-12"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7aabb8]" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="glass-input w-full pr-12"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7aabb8]" />
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="glass-input w-full pr-12"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full glass-button bg-gradient-to-r from-[#7aabb8] to-[#2b6f7a] text-white font-bold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Changing Password...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Change Password
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
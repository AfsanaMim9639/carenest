// components/admin/settings/SystemSection.jsx
"use client";
import { motion } from "framer-motion";
import { Settings, Globe, Clock, Palette, Database } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SystemSection() {
  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "Asia/Dhaka",
    dateFormat: "DD/MM/YYYY",
    currency: "BDT",
    theme: "dark",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("System settings saved successfully!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } catch (error) {
      toast.error("Failed to save settings", {
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

  const handleClearCache = async () => {
    try {
      toast.loading("Clearing cache...", { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Cache cleared successfully!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } catch (error) {
      toast.error("Failed to clear cache", {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[#2b6f7a]/20">
          <Settings className="w-6 h-6 text-[#2b6f7a]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-gray-400 text-sm">
            Configure system-wide preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#a3c4e0]" />
            Language
          </label>
          <select
            value={systemSettings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="glass-input w-full"
          >
            <option value="en" className="bg-[#081e28]">
              English
            </option>
            <option value="bn" className="bg-[#081e28]">
              বাংলা (Bengali)
            </option>
            <option value="hi" className="bg-[#081e28]">
              हिन्दी (Hindi)
            </option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a3c4e0]" />
            Timezone
          </label>
          <select
            value={systemSettings.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="glass-input w-full"
          >
            <option value="Asia/Dhaka" className="bg-[#081e28]">
              Asia/Dhaka (UTC+6)
            </option>
            <option value="Asia/Kolkata" className="bg-[#081e28]">
              Asia/Kolkata (UTC+5:30)
            </option>
            <option value="Asia/Dubai" className="bg-[#081e28]">
              Asia/Dubai (UTC+4)
            </option>
            <option value="Europe/London" className="bg-[#081e28]">
              Europe/London (UTC+0)
            </option>
            <option value="America/New_York" className="bg-[#081e28]">
              America/New_York (UTC-5)
            </option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a3c4e0]" />
            Date Format
          </label>
          <select
            value={systemSettings.dateFormat}
            onChange={(e) => handleChange("dateFormat", e.target.value)}
            className="glass-input w-full"
          >
            <option value="DD/MM/YYYY" className="bg-[#081e28]">
              DD/MM/YYYY
            </option>
            <option value="MM/DD/YYYY" className="bg-[#081e28]">
              MM/DD/YYYY
            </option>
            <option value="YYYY-MM-DD" className="bg-[#081e28]">
              YYYY-MM-DD
            </option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#a3c4e0]" />
            Currency
          </label>
          <select
            value={systemSettings.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="glass-input w-full"
          >
            <option value="BDT" className="bg-[#081e28]">
              BDT (৳) - Bangladeshi Taka
            </option>
            <option value="USD" className="bg-[#081e28]">
              USD ($) - US Dollar
            </option>
            <option value="EUR" className="bg-[#081e28]">
              EUR (€) - Euro
            </option>
            <option value="INR" className="bg-[#081e28]">
              INR (₹) - Indian Rupee
            </option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#a3c4e0]" />
            Theme
          </label>
          <select
            value={systemSettings.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
            className="glass-input w-full"
          >
            <option value="dark" className="bg-[#081e28]">
              Dark Mode
            </option>
            <option value="light" className="bg-[#081e28]">
              Light Mode
            </option>
            <option value="auto" className="bg-[#081e28]">
              Auto (System)
            </option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="w-full glass-button bg-gradient-to-r from-[#2b6f7a] to-[#0b4345] text-white font-bold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5" />
                Save System Settings
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearCache}
            className="w-full glass-button border border-white/20 text-white font-semibold py-3 flex items-center justify-center gap-2 hover:bg-white/10"
          >
            <Database className="w-5 h-5" />
            Clear Cache
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
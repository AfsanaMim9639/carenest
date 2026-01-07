// components/admin/settings/NotificationsSection.jsx
"use client";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NotificationsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    systemUpdates: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Notification settings saved!", {
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

  const notificationItems = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Receive notifications via email",
      icon: Mail,
      color: "text-[#a3c4e0]",
    },
    {
      key: "pushNotifications",
      title: "Push Notifications",
      description: "Receive push notifications on your device",
      icon: Bell,
      color: "text-[#7aabb8]",
    },
    {
      key: "smsNotifications",
      title: "SMS Notifications",
      description: "Receive notifications via SMS",
      icon: MessageSquare,
      color: "text-[#4d8a9b]",
    },
    {
      key: "bookingAlerts",
      title: "Booking Alerts",
      description: "Get notified about new bookings",
      icon: Calendar,
      color: "text-[#2b6f7a]",
    },
    {
      key: "paymentAlerts",
      title: "Payment Alerts",
      description: "Get notified about payment updates",
      icon: Bell,
      color: "text-[#0e545e]",
    },
    {
      key: "systemUpdates",
      title: "System Updates",
      description: "Receive important system updates",
      icon: Bell,
      color: "text-[#0b4345]",
    },
    {
      key: "marketingEmails",
      title: "Marketing Emails",
      description: "Receive promotional and marketing emails",
      icon: Mail,
      color: "text-[#092e35]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[#4d8a9b]/20">
          <Bell className="w-6 h-6 text-[#4d8a9b]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Notification Preferences
          </h2>
          <p className="text-gray-400 text-sm">
            Manage how you receive notifications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {notificationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-subtle p-4 flex items-center justify-between hover:bg-white/10 transition-all duration-300 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  settings[item.key]
                    ? "bg-gradient-to-r from-[#a3c4e0] to-[#4d8a9b]"
                    : "bg-gray-600"
                }`}
              >
                <motion.div
                  animate={{
                    x: settings[item.key] ? 28 : 2,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={loading}
        className="w-full glass-button bg-gradient-to-r from-[#4d8a9b] to-[#0e545e] text-white font-bold py-3 mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </motion.button>
    </motion.div>
  );
}
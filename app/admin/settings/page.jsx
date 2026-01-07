// app/admin/settings/page.jsx
"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Toaster } from "react-hot-toast";
import ProfileSection from "@/components/admin/settings/ProfileSection";
import SecuritySection from "@/components/admin/settings/SecuritySection";
import NotificationsSection from "@/components/admin/settings/NotificationsSection";
import SystemSection from "@/components/admin/settings/SystemSection";
import DangerZoneSection from "@/components/admin/settings/DangerZoneSection";

export default function AdminSettingsPage() {
  const titleRef = useRef(null);

  // Mock user data - replace with actual session/API data
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    image: null,
    role: "admin",
  };

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 gradient-text">
            Settings
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account and system preferences
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <ProfileSection user={user} />

          {/* Security Settings */}
          <SecuritySection />

          {/* Notification Preferences - Full Width */}
          <div className="lg:col-span-2">
            <NotificationsSection />
          </div>

          {/* System Settings */}
          <SystemSection />

          {/* Danger Zone */}
          <DangerZoneSection />
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            Last updated:{" "}
            <span className="text-[#a3c4e0] font-semibold">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Version 1.0.0 • © 2025 Care Services Admin
          </p>
        </motion.div>
      </div>
    </div>
  );
}
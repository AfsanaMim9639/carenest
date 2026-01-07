// components/admin/settings/ProfileSection.jsx
"use client";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ProfileSection({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.image || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(16, 185, 129, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } catch (error) {
      toast.error("Failed to update profile", {
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
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[#a3c4e0]/20">
          <User className="w-6 h-6 text-[#a3c4e0]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <p className="text-gray-400 text-sm">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#a3c4e0] to-[#4d8a9b] flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#a3c4e0] text-white shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Profile Picture</p>
            <p className="text-gray-400 text-sm">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#a3c4e0]" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="glass-input w-full"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#a3c4e0]" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="glass-input w-full"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#a3c4e0]" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="glass-input w-full"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#a3c4e0]" />
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="glass-input w-full resize-none"
            placeholder="Enter your address"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full glass-button bg-gradient-to-r from-[#a3c4e0] to-[#4d8a9b] text-white font-bold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
// components/admin/services/ServiceFormModal.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ServiceFormModal({ service, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Baby Care",
    rate: "",
    unit: "hour",
    description: "",
    features: [""],
    isActive: true,
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        category: service.category || "Baby Care",
        rate: service.rate || "",
        unit: service.unit || "hour",
        description: service.description || "",
        features: service.features?.length > 0 ? service.features : [""],
        isActive: service.isActive ?? true,
        image: service.image || "",
      });
    } else {
      setFormData({
        name: "",
        category: "Baby Care",
        rate: "",
        unit: "hour",
        description: "",
        features: [""],
        isActive: true,
        image: "",
      });
    }
  }, [service, isOpen]);

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty features
    const cleanedFeatures = formData.features.filter(f => f.trim() !== "");
    
    if (cleanedFeatures.length === 0) {
      toast.error("Please add at least one feature", {
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
      await onSave({
        ...formData,
        features: cleanedFeatures,
        rate: parseFloat(formData.rate),
      });
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              className="glass-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0b4345] to-[#2b6f7a] px-8 py-6 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
                <h2 className="text-3xl font-bold text-white">
                  {service ? "Edit Service" : "Add New Service"}
                </h2>
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
                {/* Service Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter service name"
                    className="glass-input w-full"
                    required
                  />
                </div>

                {/* Category & Rate */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="glass-input w-full"
                      required
                    >
                      <option value="Baby Care" className="bg-[#081e28]">
                        Baby Care
                      </option>
                      <option value="Elderly Care" className="bg-[#081e28]">
                        Elderly Care
                      </option>
                      <option value="Special Care" className="bg-[#081e28]">
                        Special Care
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Rate (৳) *
                    </label>
                    <input
                      type="number"
                      value={formData.rate}
                      onChange={(e) =>
                        setFormData({ ...formData, rate: e.target.value })
                      }
                      placeholder="Enter rate"
                      className="glass-input w-full"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Unit & Status */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="glass-input w-full"
                      required
                    >
                      <option value="hour" className="bg-[#081e28]">
                        Per Hour
                      </option>
                      <option value="day" className="bg-[#081e28]">
                        Per Day
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-4 h-12">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.isActive}
                          onChange={() =>
                            setFormData({ ...formData, isActive: true })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-white">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!formData.isActive}
                          onChange={() =>
                            setFormData({ ...formData, isActive: false })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-white">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter service description"
                    rows={4}
                    className="glass-input w-full resize-none"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL (optional)"
                    className="glass-input w-full"
                  />
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-semibold">
                      Features *
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addFeature}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#a3c4e0]/20 text-[#a3c4e0] hover:bg-[#a3c4e0]/30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                          placeholder={`Feature ${index + 1}`}
                          className="glass-input flex-1"
                        />
                        {formData.features.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFeature(index)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

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
                        {service ? "Update Service" : "Create Service"}
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
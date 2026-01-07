// components/admin/services/ServiceFilters.jsx
"use client";
import { motion } from "framer-motion";
import { Search, Filter, Plus } from "lucide-react";

export default function ServiceFilters({
  search,
  setSearch,
  category,
  setCategory,
  isActive,
  setIsActive,
  onRefresh,
  onAddNew,
}) {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Baby Care", label: "Baby Care" },
    { value: "Elderly Care", label: "Elderly Care" },
    { value: "Special Care", label: "Special Care" },
  ];

  const statuses = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by service name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-12 pr-4 py-3 text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input w-full pl-12 pr-4 py-3 text-white cursor-pointer appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-[#081e28] text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="glass-input w-full px-4 py-3 text-white cursor-pointer appearance-none"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value} className="bg-[#081e28] text-white">
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="glass-button flex-1 md:flex-none whitespace-nowrap px-6 py-3"
          >
            🔄 Refresh
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddNew}
            className="glass-button flex-1 md:flex-none bg-gradient-to-r from-[#a3c4e0] to-[#4d8a9b] text-white font-bold px-6 py-3 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
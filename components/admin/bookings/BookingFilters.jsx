// components/admin/bookings/BookingFilters.jsx
"use client";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export default function BookingFilters({
  search,
  setSearch,
  status,
  setStatus,
  onRefresh,
}) {
  const statuses = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
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
            placeholder="Search by name, phone, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-12 pr-4 py-3 text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="glass-input w-full pl-12 pr-4 py-3 text-white cursor-pointer appearance-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#081e28] text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="glass-button whitespace-nowrap px-6 py-3"
        >
          🔄 Refresh
        </motion.button>
      </div>
    </motion.div>
  );
}
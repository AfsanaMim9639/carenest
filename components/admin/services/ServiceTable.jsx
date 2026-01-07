// components/admin/services/ServiceTable.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Edit, Trash2, DollarSign } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ServiceTable({
  services,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (!loading && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr");
      gsap.fromTo(
        rows,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [services, loading]);

  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Services Found</h3>
        <p className="text-gray-400">Try adjusting your filters or add a new service</p>
      </motion.div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Service Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Rate
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Popularity
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {services.map((service) => (
                <motion.tr
                  key={service._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm">
                    <span className="font-mono text-[#a3c4e0] font-semibold">
                      #{service.serviceId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {service.image && service.image !== '/images/services/default.jpg' ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a3c4e0] to-[#4d8a9b] flex items-center justify-center text-white font-bold">
                          {service.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">{service.name}</div>
                        <div className="text-gray-400 text-xs line-clamp-1">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#a3c4e0]/20 text-[#a3c4e0] border border-[#a3c4e0]/30">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#a3c4e0] font-bold">
                      <DollarSign className="w-4 h-4" />
                      ৳{service.rate}
                      <span className="text-gray-400 text-xs font-normal">
                        /{service.unit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        service.isActive
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {service.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#a3c4e0] to-[#4d8a9b]"
                          style={{ width: `${Math.min(service.popularity, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs">
                        {service.popularity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(service)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(service)}
                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(service)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
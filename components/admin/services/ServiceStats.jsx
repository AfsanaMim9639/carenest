// components/admin/services/ServiceStats.jsx
"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Baby,
  Users,
  Heart
} from "lucide-react";

export default function ServiceStats({ stats, loading }) {
  const statsRef = useRef([]);

  useEffect(() => {
    if (!loading && stats) {
      statsRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(
            el,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: "back.out(1.7)",
            }
          );
        }
      });
    }
  }, [loading, stats]);

  const statCards = [
    {
      label: "Total Services",
      value: stats?.total || 0,
      icon: Package,
      gradient: "from-[#a3c4e0] to-[#7aabb8]",
      iconColor: "text-[#a3c4e0]",
    },
    {
      label: "Active Services",
      value: stats?.active || 0,
      icon: CheckCircle,
      gradient: "from-[#7aabb8] to-[#4d8a9b]",
      iconColor: "text-green-400",
    },
    {
      label: "Inactive Services",
      value: stats?.inactive || 0,
      icon: XCircle,
      gradient: "from-[#4d8a9b] to-[#2b6f7a]",
      iconColor: "text-red-400",
    },
    {
      label: "Baby Care",
      value: stats?.babyCare || 0,
      icon: Baby,
      gradient: "from-[#2b6f7a] to-[#0e545e]",
      iconColor: "text-pink-400",
    },
    {
      label: "Elderly Care",
      value: stats?.elderlyCare || 0,
      icon: Users,
      gradient: "from-[#0e545e] to-[#0b4345]",
      iconColor: "text-blue-400",
    },
    {
      label: "Special Care",
      value: stats?.specialCare || 0,
      icon: Heart,
      gradient: "from-[#0b4345] to-[#092e35]",
      iconColor: "text-purple-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            ref={(el) => (statsRef.current[index] = el)}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-6 relative overflow-hidden group cursor-pointer"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />

            <div className={`mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300 ${stat.iconColor}`}>
              <IconComponent className="w-10 h-10" strokeWidth={1.5} />
            </div>

            <div className="text-3xl font-bold text-white mb-1 relative z-10">
              {stat.value}
            </div>

            <div className="text-sm text-gray-300 relative z-10">
              {stat.label}
            </div>

            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
// components/admin/bookings/BookingStats.jsx
"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Award, 
  XCircle, 
  DollarSign 
} from "lucide-react";

export default function BookingStats({ stats, loading }) {
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
      label: "Total Bookings",
      value: stats?.total || 0,
      icon: FileText,
      gradient: "from-[#a3c4e0] to-[#7aabb8]",
      iconColor: "text-[#a3c4e0]",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      gradient: "from-[#7aabb8] to-[#4d8a9b]",
      iconColor: "text-yellow-400",
    },
    {
      label: "Confirmed",
      value: stats?.confirmed || 0,
      icon: CheckCircle,
      gradient: "from-[#4d8a9b] to-[#2b6f7a]",
      iconColor: "text-blue-400",
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      icon: Award,
      gradient: "from-[#2b6f7a] to-[#0e545e]",
      iconColor: "text-green-400",
    },
    {
      label: "Cancelled",
      value: stats?.cancelled || 0,
      icon: XCircle,
      gradient: "from-[#0e545e] to-[#0b4345]",
      iconColor: "text-red-400",
    },
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      gradient: "from-[#0b4345] to-[#092e35]",
      iconColor: "text-emerald-400",
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
            {/* Background gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />

            {/* Icon */}
            <div className={`mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300 ${stat.iconColor}`}>
              <IconComponent className="w-10 h-10" strokeWidth={1.5} />
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-white mb-1 relative z-10">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm text-gray-300 relative z-10">
              {stat.label}
            </div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
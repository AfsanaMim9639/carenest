"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, Calendar, DollarSign, TrendingUp, 
  Shield, Settings, BarChart3, Clock 
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#7aabb8] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Revenue",
      value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: Clock,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
          </div>
          <p className="text-white/60">Welcome back, {session?.user?.name}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </div>
              </div>
              <h3 className="text-white/60 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#7aabb8]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/users')}
              className="glass-subtle p-4 rounded-lg text-left hover:bg-white/10 transition-all"
            >
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Manage Users</h3>
              <p className="text-white/60 text-sm">View and manage all users</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/bookings')}
              className="glass-subtle p-4 rounded-lg text-left hover:bg-white/10 transition-all"
            >
              <Calendar className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Manage Bookings</h3>
              <p className="text-white/60 text-sm">View and update bookings</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/analytics')}
              className="glass-subtle p-4 rounded-lg text-left hover:bg-white/10 transition-all"
            >
              <BarChart3 className="w-6 h-6 text-amber-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">View Analytics</h3>
              <p className="text-white/60 text-sm">Detailed reports and insights</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
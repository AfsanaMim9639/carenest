import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import dbConnect from '@/lib/db/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import User from '@/models/User';

async function getDashboardStats() {
  await dbConnect();

  const [
    totalRevenue,
    totalBookings,
    totalUsers,
    recentPayments,
    statusCounts
  ] = await Promise.all([
    // Total Revenue
    Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    
    // Total Bookings
    Booking.countDocuments(),
    
    // Total Users
    User.countDocuments({ role: { $ne: 'admin' } }),
    
    // Recent Payments
    Payment.find({ status: 'succeeded' })
      .populate('user', 'name email')
      .populate('booking', 'serviceDetails')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    
    // Booking Status Counts
    Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const statusMap = statusCounts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    revenue,
    totalBookings,
    totalUsers,
    recentPayments,
    statusCounts: statusMap
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Dashboard Overview
        </h1>
        <p className="text-theme-200">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          trend="+12.5%"
          trendUp={true}
          gradient="from-green-400 to-emerald-600"
        />
        
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar size={24} />}
          trend="+8.2%"
          trendUp={true}
          gradient="from-blue-400 to-indigo-600"
        />
        
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
          trend="+23.1%"
          trendUp={true}
          gradient="from-purple-400 to-pink-600"
        />
        
        <StatCard
          title="Active Bookings"
          value={stats.statusCounts.confirmed || 0}
          icon={<TrendingUp size={24} />}
          trend="-3.4%"
          trendUp={false}
          gradient="from-orange-400 to-red-600"
        />
      </div>

      {/* Booking Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Cards */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Booking Status
          </h2>
          <div className="space-y-3">
            <StatusItem
              label="Pending"
              count={stats.statusCounts.pending || 0}
              icon={<Clock size={18} />}
              color="text-yellow-400"
            />
            <StatusItem
              label="Confirmed"
              count={stats.statusCounts.confirmed || 0}
              icon={<CheckCircle size={18} />}
              color="text-green-400"
            />
            <StatusItem
              label="In Progress"
              count={stats.statusCounts.in_progress || 0}
              icon={<AlertCircle size={18} />}
              color="text-blue-400"
            />
            <StatusItem
              label="Completed"
              count={stats.statusCounts.completed || 0}
              icon={<CheckCircle size={18} />}
              color="text-emerald-400"
            />
            <StatusItem
              label="Cancelled"
              count={stats.statusCounts.cancelled || 0}
              icon={<XCircle size={18} />}
              color="text-red-400"
            />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Payments
          </h2>
          <div className="space-y-3">
            {stats.recentPayments.map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {payment.user?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-theme-200">
                    {payment.booking?.serviceDetails?.type || 'Service'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-theme-300">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, gradient }) {
  return (
    <div className="glass-card-hover p-6 relative overflow-hidden group">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg`}>
            {icon}
          </div>
          <span className={`text-sm font-semibold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
        
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-theme-200">{title}</p>
      </div>
    </div>
  );
}

function StatusItem({ label, count, icon, color }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-3">
        <span className={color}>{icon}</span>
        <span className="text-sm text-white">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{count}</span>
    </div>
  );
}
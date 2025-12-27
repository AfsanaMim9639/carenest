'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments'); // ✅ Correct path
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = 
        payment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.stripePaymentIntentId.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Payment History
          </h1>
          <p className="text-theme-200">
            Manage and track all payment transactions
          </p>
        </div>
        <button className="glass-button flex items-center space-x-2">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="text-green-400"
        />
        <SummaryCard
          title="Successful"
          value={payments.filter(p => p.status === 'succeeded').length}
          color="text-blue-400"
        />
        <SummaryCard
          title="Pending"
          value={payments.filter(p => p.status === 'pending').length}
          color="text-yellow-400"
        />
        <SummaryCard
          title="Failed"
          value={payments.filter(p => p.status === 'failed').length}
          color="text-red-400"
        />
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-300" size={18} />
            <input
              type="text"
              placeholder="Search by user, email, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input w-48"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input w-48"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchPayments}
            className="glass-button px-4"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-400"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-theme-300">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    Transaction ID
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    User
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-theme-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <PaymentRow key={payment._id} payment={payment} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="glass-card p-4">
      <p className="text-sm text-theme-200 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function PaymentRow({ payment }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'refunded':
        return <RefreshCw size={16} className="text-blue-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-400 bg-green-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'refunded':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="p-4">
        <span className="text-sm text-theme-100 font-mono">
          {payment.stripePaymentIntentId.slice(0, 20)}...
        </span>
      </td>
      <td className="p-4">
        <div>
          <p className="text-sm text-white font-medium">
            {payment.user?.name || 'N/A'}
          </p>
          <p className="text-xs text-theme-300">
            {payment.user?.email || 'N/A'}
          </p>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm font-bold text-white">
          ${payment.amount.toFixed(2)}
        </span>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
          {getStatusIcon(payment.status)}
          <span className="capitalize">{payment.status}</span>
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm text-theme-200">
          {new Date(payment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </td>
      <td className="p-4">
        <button className="text-theme-300 hover:text-theme-100 transition-colors">
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
}
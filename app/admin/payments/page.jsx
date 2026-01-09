'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, 
  Download, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  DollarSign
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
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
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Payment History
          </h1>
          <p className="text-gray-400">
            Manage and track all payment transactions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button flex items-center space-x-2 px-6 py-3"
        >
          <Download size={18} />
          <span>Export</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          color="text-green-400"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <SummaryCard
          title="Completed"
          value={payments.filter(p => p.status === 'completed').length}
          color="text-blue-400"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <SummaryCard
          title="Pending"
          value={payments.filter(p => p.status === 'pending').length}
          color="text-yellow-400"
          icon={<Clock className="w-6 h-6" />}
        />
        <SummaryCard
          title="Failed"
          value={payments.filter(p => p.status === 'failed').length}
          color="text-red-400"
          icon={<XCircle className="w-6 h-6" />}
        />
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            className="glass-input w-full md:w-48"
          >
            <option value="all" className="bg-[#081e28]">All Status</option>
            <option value="completed" className="bg-[#081e28]">Completed</option>
            <option value="pending" className="bg-[#081e28]">Pending</option>
            <option value="failed" className="bg-[#081e28]">Failed</option>
            <option value="refunded" className="bg-[#081e28]">Refunded</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input w-full md:w-48"
          >
            <option value="date_desc" className="bg-[#081e28]">Newest First</option>
            <option value="date_asc" className="bg-[#081e28]">Oldest First</option>
            <option value="amount_desc" className="bg-[#081e28]">Highest Amount</option>
            <option value="amount_asc" className="bg-[#081e28]">Lowest Amount</option>
          </select>

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPayments}
            className="glass-button px-4 py-2"
          >
            <RefreshCw size={18} />
          </motion.button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3c4e0]"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-gray-400">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    Transaction ID
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    User
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <PaymentRow 
                    key={payment._id} 
                    payment={payment}
                    onView={(p) => {
                      setSelectedPayment(p);
                      setShowDetailsModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, color, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">{title}</p>
        <div className={color}>{icon}</div>
      </div>
      <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}

function PaymentRow({ payment, onView }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
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
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'refunded':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="p-4">
        <span className="text-sm text-[#a3c4e0] font-mono">
          {payment.stripePaymentIntentId.slice(0, 20)}...
        </span>
      </td>
      <td className="p-4">
        <div>
          <p className="text-sm text-white font-medium">
            {payment.user?.name || 'N/A'}
          </p>
          <p className="text-xs text-gray-400">
            {payment.user?.email || 'N/A'}
          </p>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm font-bold text-white">
          ৳{payment.amount.toLocaleString()}
        </span>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          {getStatusIcon(payment.status)}
          <span className="capitalize">{payment.status}</span>
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm text-gray-300">
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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onView(payment)}
          className="text-gray-400 hover:text-[#a3c4e0] transition-colors"
        >
          <Eye size={18} />
        </motion.button>
      </td>
    </tr>
  );
}

function PaymentDetailsModal({ payment, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <DetailRow label="Transaction ID" value={payment.stripePaymentIntentId} />
          <DetailRow label="User" value={payment.user?.name || 'N/A'} />
          <DetailRow label="Email" value={payment.user?.email || 'N/A'} />
          <DetailRow label="Amount" value={`৳${payment.amount.toLocaleString()}`} />
          <DetailRow label="Currency" value={payment.currency} />
          <DetailRow label="Status" value={payment.status} />
          <DetailRow label="Payment Method" value={payment.paymentMethod} />
          <DetailRow 
            label="Date" 
            value={new Date(payment.createdAt).toLocaleString()} 
          />
          {payment.paidAt && (
            <DetailRow 
              label="Paid At" 
              value={new Date(payment.paidAt).toLocaleString()} 
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-white/10">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-medium text-sm text-right">{value}</span>
    </div>
  );
}
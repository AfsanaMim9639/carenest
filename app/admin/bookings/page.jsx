// app/admin/bookings/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";
import BookingStats from "@/components/admin/bookings/BookingStats";
import BookingFilters from "@/components/admin/bookings/BookingFilters";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingPagination from "@/components/admin/bookings/BookingPagination";
import BookingViewModal from "@/components/admin/bookings/BookingViewModal";
import BookingEditModal from "@/components/admin/bookings/BookingEditModal";
import BookingDeleteModal from "@/components/admin/bookings/BookingDeleteModal";

export default function AdminBookingsPage() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, booking: null });
  const [editModal, setEditModal] = useState({ isOpen: false, booking: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, booking: null });

  const titleRef = useRef(null);

  // Fetch stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/bookings/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, []);

  // Refetch on filter/page change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, page]);

  // Title animation
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Handle update booking
  const handleUpdateBooking = async (id, updateData) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      await fetchBookings();
      await fetchStats();
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete booking");

      await fetchBookings();
      await fetchStats();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 gradient-text">
            Booking Management
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and track all bookings in one place
          </p>
        </motion.div>

        {/* Stats */}
        <BookingStats stats={stats} loading={statsLoading} />

        {/* Filters */}
        <BookingFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          onRefresh={() => {
            fetchBookings();
            fetchStats();
            toast.success("Data refreshed successfully!", {
              duration: 2000,
              position: "top-right",
              style: {
                background: "rgba(16, 185, 129, 0.9)",
                color: "#fff",
                backdropFilter: "blur(10px)",
              },
            });
          }}
        />

        {/* Table */}
        <BookingTable
          bookings={bookings}
          loading={loading}
          onView={(booking) => setViewModal({ isOpen: true, booking })}
          onEdit={(booking) => setEditModal({ isOpen: true, booking })}
          onDelete={(booking) => setDeleteModal({ isOpen: true, booking })}
        />

        {/* Pagination */}
        <BookingPagination
          page={pagination.page}
          totalPages={pagination.pages}
          onPageChange={setPage}
        />

        {/* Modals */}
        <BookingViewModal
          booking={viewModal.booking}
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, booking: null })}
        />

        <BookingEditModal
          booking={editModal.booking}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, booking: null })}
          onSave={handleUpdateBooking}
        />

        <BookingDeleteModal
          booking={deleteModal.booking}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, booking: null })}
          onDelete={handleDeleteBooking}
        />
      </div>
    </div>
  );
}
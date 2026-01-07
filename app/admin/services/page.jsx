// app/admin/services/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";
import ServiceStats from "@/components/admin/services/ServiceStats";
import ServiceFilters from "@/components/admin/services/ServiceFilters";
import ServiceTable from "@/components/admin/services/ServiceTable";
import BookingPagination from "@/components/admin/bookings/BookingPagination";
import ServiceFormModal from "@/components/admin/services/ServiceFormModal";
import ServiceViewModal from "@/components/admin/services/ServiceViewModal";
import ServiceDeleteModal from "@/components/admin/services/ServiceDeleteModal";

export default function AdminServicesPage() {
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, service: null });
  const [formModal, setFormModal] = useState({ isOpen: false, service: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, service: null });

  const titleRef = useRef(null);

  // Fetch stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/services/stats");
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

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (isActive) params.append("isActive", isActive);

      const res = await fetch(`/api/admin/services?${params}`);
      const data = await res.json();
      setServices(data.services);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services", {
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
    fetchServices();
  }, []);

  // Refetch on filter/page change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, isActive, page]);

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

  // Handle create/update service
  const handleSaveService = async (serviceData) => {
    try {
      const isUpdate = formModal.service !== null;
      const url = isUpdate
        ? `/api/admin/services/${formModal.service._id}`
        : "/api/admin/services";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) throw new Error("Failed to save service");

      toast.success(
        `Service ${isUpdate ? "updated" : "created"} successfully!`,
        {
          duration: 3000,
          position: "top-right",
          style: {
            background: "rgba(16, 185, 129, 0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        }
      );

      await fetchServices();
      await fetchStats();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save service", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      });
      throw error;
    }
  };

  // Handle delete service
  const handleDeleteService = async (id) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete service");

      await fetchServices();
      await fetchStats();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
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
            Service Management
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and organize all your services
          </p>
        </motion.div>

        {/* Stats */}
        <ServiceStats stats={stats} loading={statsLoading} />

        {/* Filters */}
        <ServiceFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          isActive={isActive}
          setIsActive={setIsActive}
          onRefresh={() => {
            fetchServices();
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
          onAddNew={() => setFormModal({ isOpen: true, service: null })}
        />

        {/* Table */}
        <ServiceTable
          services={services}
          loading={loading}
          onView={(service) => setViewModal({ isOpen: true, service })}
          onEdit={(service) => setFormModal({ isOpen: true, service })}
          onDelete={(service) => setDeleteModal({ isOpen: true, service })}
        />

        {/* Pagination */}
        <BookingPagination
          page={pagination.page}
          totalPages={pagination.pages}
          onPageChange={setPage}
        />

        {/* Modals */}
        <ServiceViewModal
          service={viewModal.service}
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, service: null })}
        />

        <ServiceFormModal
          service={formModal.service}
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, service: null })}
          onSave={handleSaveService}
        />

        <ServiceDeleteModal
          service={deleteModal.service}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, service: null })}
          onDelete={handleDeleteService}
        />
      </div>
    </div>
  );
}
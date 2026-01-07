// components/admin/bookings/BookingPagination.jsx
"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingPagination({ page, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mt-8"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Page Info */}
        <div className="text-gray-300">
          Page <span className="text-[#a3c4e0] font-bold">{page}</span> of{" "}
          <span className="text-[#a3c4e0] font-bold">{totalPages}</span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`glass-button flex items-center gap-2 px-4 py-2 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>

          {/* Page Numbers */}
          <div className="hidden md:flex items-center gap-2">
            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={`dots-${index}`} className="px-3 text-gray-500">
                  ...
                </span>
              ) : (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    page === pageNum
                      ? "bg-gradient-to-br from-[#a3c4e0] to-[#4d8a9b] text-white"
                      : "glass-subtle text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            )}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={`glass-button flex items-center gap-2 px-4 py-2 ${
              page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
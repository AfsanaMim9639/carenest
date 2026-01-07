// components/ConditionalLayout.js
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes - শুধু children, no Navbar/Footer
    return <>{children}</>;
  }

  // Normal routes - Navbar + children + Footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
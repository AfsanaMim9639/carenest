"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassButton({ 
  children, 
  className, 
  variant = "primary",
  ...props 
}) {
  const variants = {
    primary: "glass-button hover:scale-105",
    secondary: "glass-subtle hover:bg-white/10 px-6 py-3 rounded-xl",
    gradient: "bg-gradient-theme text-white px-6 py-3 rounded-xl hover:opacity-90",
  };

  return (
    <motion.button
      className={cn(variants[variant], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
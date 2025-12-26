"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = false,
  ...props 
}) {
  return (
    <motion.div
      className={cn(
        "glass-card p-8 rounded-2xl",
        glow && "glow",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
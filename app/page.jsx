"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <AnimatedBackground />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold">Care.xyz</h1>
          <p className="text-xl text-gray-300">
            Trusted Care Services for Your Loved Ones
          </p>
          <GlassButton>Get Started</GlassButton>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
        {["Baby Care", "Elderly Care", "Special Care"].map((service, i) => (
          <GlassCard key={i}>
            <div className="text-center space-y-3">
              <span className="text-4xl">👶</span>
              <h3 className="text-xl font-semibold">{service}</h3>
              <p className="text-gray-300">
                Professional and caring service for your family
              </p>
            </div>
          </GlassCard>
        ))}
      </section>
    </>
  );
}

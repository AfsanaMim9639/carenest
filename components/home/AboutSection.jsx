"use client";
import { motion } from "framer-motion";
import { Shield, Clock, Heart, Award } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: "Verified Caregivers",
      description: "All our caregivers undergo thorough background checks and verification"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock support whenever you need care services"
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Dedicated professionals who treat your family like their own"
    },
    {
      icon: Award,
      title: "Certified Professionals",
      description: "Trained and certified caregivers with years of experience"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            About CareNest
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We connect families with trusted, professional caregivers to provide the best care 
            for your loved ones in the comfort of your home.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-6 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-theme-50 to-theme-200 flex items-center justify-center"
              >
                <feature.icon className="w-8 h-8 text-theme-900" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 lg:p-12 mt-16 text-center"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Our Mission
          </h3>
          <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
            At CareNest, we believe everyone deserves access to quality care services. 
            Our platform makes it easy to find, book, and manage professional caregivers 
            who are committed to providing exceptional service with compassion and respect.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
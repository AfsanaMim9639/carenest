"use client";
import { motion } from "framer-motion";
import { Baby, Users, Stethoscope, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function ServicesOverview() {
  const services = [
    {
      icon: Baby,
      title: "Baby Care",
      description: "Professional babysitting services with certified caregivers who understand child development and provide age-appropriate activities.",
      features: ["Age-appropriate activities", "Meal preparation", "Sleep routines", "Educational games"],
      price: "৳500/hour",
      gradient: "linear-gradient(to bottom right, #a3c4e0, #7aabb8)",
      bgGradient: "linear-gradient(to bottom right, #a3c4e0, #7aabb8)",
    },
    {
      icon: Users,
      title: "Elderly Care",
      description: "Compassionate care for seniors with focus on dignity, respect, and assistance with daily living activities.",
      features: ["Personal care", "Medication reminders", "Mobility support", "Companionship"],
      price: "৳600/hour",
      gradient: "linear-gradient(to bottom right, #7aabb8, #4d8a9b)",
      bgGradient: "linear-gradient(to bottom right, #7aabb8, #4d8a9b)",
    },
    {
      icon: Stethoscope,
      title: "Special Care",
      description: "Specialized care for patients with chronic conditions or recovering from illness, provided by trained medical professionals.",
      features: ["Medical monitoring", "Therapy assistance", "Emergency support", "Vital checks"],
      price: "৳800/hour",
      gradient: "linear-gradient(to bottom right, #4d8a9b, #2b6f7a)",
      bgGradient: "linear-gradient(to bottom right, #4d8a9b, #2b6f7a)",
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4"
              style={{
                backgroundImage: 'linear-gradient(to right, #a3c4e0, #7aabb8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Our Services
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive care solutions tailored to meet your family's unique needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group"
              >
                {/* Background Gradient on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: service.bgGradient }}
                />
              
                {/* Icon */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: service.gradient,
                      boxShadow: '0 10px 30px -5px rgba(163, 196, 224, 0.3)'
                    }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/80 text-sm">
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#a3c4e0' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold"
                            style={{
                              backgroundImage: 'linear-gradient(to right, #a3c4e0, #7aabb8)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                        {service.price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/services" className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 px-4 text-sm rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                        >
                          View Details
                        </motion.button>
                      </Link>
                      <Link href={`/booking/${index + 1}`} className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 px-4 text-sm rounded-lg text-white font-semibold transition-all"
                          style={{ 
                            background: 'linear-gradient(to right, #7aabb8, #4d8a9b)',
                            boxShadow: '0 4px 15px -3px rgba(122, 171, 184, 0.3)'
                          }}
                        >
                          Book Now
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
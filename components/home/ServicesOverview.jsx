"use client";
import { motion } from "framer-motion";
import { Baby, Heart, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesOverview() {
  const services = [
    {
      icon: Baby,
      title: "Baby Care",
      description: "Professional babysitting services with certified caregivers who understand child development and provide age-appropriate activities.",
      features: ["Age-appropriate activities", "Meal preparation", "Sleep routines", "Educational games"],
      price: "৳500/hour",
      color: "from-theme-50 to-theme-100",
      image: "👶"
    },
    {
      icon: Heart,
      title: "Elderly Care",
      description: "Compassionate care for seniors with focus on dignity, respect, and assistance with daily living activities.",
      features: ["Personal care", "Medication reminders", "Mobility support", "Companionship"],
      price: "৳600/hour",
      color: "from-theme-100 to-theme-200",
      image: "👴"
    },
    {
      icon: Activity,
      title: "Special Care",
      description: "Specialized care for patients with chronic conditions or recovering from illness, provided by trained medical professionals.",
      features: ["Medical monitoring", "Therapy assistance", "Emergency support", "Vital checks"],
      price: "৳800/hour",
      color: "from-theme-200 to-theme-300",
      image: "🏥"
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
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Our Services
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive care solutions tailored to meet your family's unique needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 mb-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-4xl`}
                >
                  {service.image}
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/70 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-50 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold gradient-text">{service.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/service/${index + 1}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full glass-button py-2 px-4 text-sm"
                      >
                        View Details
                      </motion.button>
                    </Link>
                    <Link href={`/booking/${index + 1}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 px-4 text-sm rounded-lg bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-semibold"
                      >
                        Book Now
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
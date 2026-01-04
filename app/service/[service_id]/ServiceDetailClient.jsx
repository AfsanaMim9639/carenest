"use client";
import { motion } from "framer-motion";
import { 
  Baby, Heart, Activity, Stethoscope, Users, 
  Clock, Shield, Award, CheckCircle, Star,
  ArrowLeft, Calendar, MapPin, Phone
} from "lucide-react";
import Link from "next/link";

// Icon mapping
const iconComponents = {
  Baby,
  Heart,
  Activity,
  Stethoscope
};

export default function ServiceDetailClient({ service }) {
  const IconComponent = iconComponents[service.icon] || Activity;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button mt-10 mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-96 lg:h-full">
              <img 
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-semibold text-sm">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
                  {service.title}
                </h1>
                <p className="text-xl text-white/80 mb-6">{service.shortDesc}</p>
                <p className="text-white/70 mb-8 leading-relaxed">{service.description}</p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass-subtle p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-theme-50 mb-2" />
                    <p className="text-sm text-white/60">Duration</p>
                    <p className="text-white font-semibold">{service.duration}</p>
                  </div>
                  <div className="glass-subtle p-4 rounded-lg">
                    <Calendar className="w-5 h-5 text-theme-50 mb-2" />
                    <p className="text-sm text-white/60">Availability</p>
                    <p className="text-white font-semibold">{service.availability}</p>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between p-6 glass-strong rounded-lg">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Starting from</p>
                    <p className="text-3xl font-bold gradient-text">{service.price}</p>
                  </div>
                  <Link href={`/booking/${service.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-lg bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold text-lg"
                    >
                      Book Now
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features & Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-theme-50" />
              Service Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="flex items-start gap-3 p-3 glass-subtle rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-theme-50 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Includes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-theme-50" />
              What's Included
            </h2>
            <ul className="space-y-3">
              {service.includes.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <div className="w-2 h-2 rounded-full bg-theme-50" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a href="tel:+8801234567890" className="flex items-center gap-3 text-white/80 hover:text-white transition">
                  <Phone className="w-5 h-5 text-theme-50" />
                  <span>+880 1234-567890</span>
                </a>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="w-5 h-5 text-theme-50" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 mt-8"
        >
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
            Why Choose CareNest?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Verified", desc: "Background checked" },
              { icon: Award, title: "Certified", desc: "Trained professionals" },
              { icon: Clock, title: "Flexible", desc: "24/7 availability" },
              { icon: Users, title: "Trusted", desc: "10,000+ families" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <item.icon className="w-12 h-12 text-theme-50 mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
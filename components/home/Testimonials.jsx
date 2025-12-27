"use client";
import { motion } from "framer-motion";
import { Star, Users, Award, TrendingUp, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Fatima Rahman",
      role: "Mother of 2",
      image: "👩",
      rating: 5,
      text: "CareNest helped me find the perfect babysitter. I can work peacefully knowing my kids are in safe hands. The booking process was so easy!"
    },
    {
      name: "Ahmed Hassan",
      role: "Son of Elderly Parent",
      image: "👨",
      rating: 5,
      text: "The elderly care service is outstanding. My father receives excellent care and companionship daily. Highly recommend CareNest!"
    },
    {
      name: "Nusrat Jahan",
      role: "Family Caregiver",
      image: "👩‍⚕️",
      rating: 5,
      text: "Professional, reliable, and caring. The special care service exceeded all our expectations. Thank you CareNest team!"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Families" },
    { icon: Award, value: "500+", label: "Verified Caregivers" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/70 mb-12">
            Join our growing community of satisfied families
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6"
              >
                <stat.icon className="w-10 h-10 text-theme-50 mx-auto mb-3" />
                <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h3>
          <p className="text-lg text-white/70">
            Real stories from real families
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-theme-50 opacity-20" />

              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-theme-50 to-theme-200 flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-theme-50 text-theme-50" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-white/80 leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
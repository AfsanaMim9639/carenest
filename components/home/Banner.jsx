"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Baby Care - 3 slides
    {
      id: 1,
      title: "Professional Baby Care",
      subtitle: "Trusted Care for Your Little Ones",
      description: "Experienced and certified babysitters available 24/7 to take care of your children with love and attention.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
      color: "from-theme-50 to-theme-100",
      features: ["Certified Caregivers", "24/7 Availability", "Background Verified"]
    },
    {
      id: 2,
      title: "Newborn Care Specialists",
      subtitle: "Expert Care for Infants",
      description: "Specialized care for newborns and infants with trained professionals who understand infant needs.",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=500&fit=crop",
      color: "from-theme-50 to-theme-100",
      features: ["Newborn Expertise", "Feeding Support", "Sleep Training"]
    },
    {
      id: 3,
      title: "Playful Learning Care",
      subtitle: "Educational Childcare",
      description: "Engaging activities and educational play that promote healthy child development and learning.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop",
      color: "from-theme-50 to-theme-100",
      features: ["Educational Activities", "Creative Play", "Social Skills"]
    },
    // Elderly Care - 3 slides
    {
      id: 4,
      title: "Elderly Care Services",
      subtitle: "Compassionate Care for Seniors",
      description: "Specialized caregivers providing dignified and respectful care for your elderly family members at home.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop",
      color: "from-theme-100 to-theme-200",
      features: ["Medical Support", "Daily Activities", "Companionship"]
    },
    {
      id: 5,
      title: "Senior Companionship",
      subtitle: "Friendly Support & Care",
      description: "Caring companions who provide emotional support, conversation, and assistance with daily routines.",
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=500&fit=crop",
      color: "from-theme-100 to-theme-200",
      features: ["Social Engagement", "Meal Assistance", "Light Housekeeping"]
    },
    {
      id: 6,
      title: "Dementia & Alzheimer's Care",
      subtitle: "Specialized Memory Care",
      description: "Expert care for seniors with memory-related conditions, ensuring safety and quality of life.",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=500&fit=crop",
      color: "from-theme-100 to-theme-200",
      features: ["Memory Support", "Safety Monitoring", "Cognitive Activities"]
    },
    // Special/Medical Care - 3 slides
    {
      id: 7,
      title: "Special Medical Care",
      subtitle: "Expert Care for Special Needs",
      description: "Professional medical caregivers trained to handle patients with special needs and chronic conditions.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop",
      color: "from-theme-200 to-theme-300",
      features: ["Trained Nurses", "Medical Equipment", "Emergency Ready"]
    },
    {
      id: 8,
      title: "Post-Surgery Recovery",
      subtitle: "Rehabilitation Support",
      description: "Dedicated care for patients recovering from surgery or medical procedures at home.",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=500&fit=crop",
      color: "from-theme-200 to-theme-300",
      features: ["Recovery Monitoring", "Physical Therapy", "Wound Care"]
    },
    {
      id: 9,
      title: "Chronic Illness Management",
      subtitle: "Long-term Care Support",
      description: "Comprehensive care for patients with chronic illnesses requiring ongoing medical attention.",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=500&fit=crop",
      color: "from-theme-200 to-theme-300",
      features: ["Health Monitoring", "Medication Management", "Doctor Coordination"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle, var(--theme-${i * 100}) 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:pr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${slides[currentSlide].color} mb-6`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-sm font-semibold text-theme-900">
                    🌟 Trusted by 10,000+ Families
                  </span>
                </motion.div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  <span className="gradient-text">{slides[currentSlide].title}</span>
                </h1>

                <h2 className="text-xl lg:text-2xl text-white/90 mb-6 font-semibold">
                  {slides[currentSlide].subtitle}
                </h2>

                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  {slides[currentSlide].description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {slides[currentSlide].features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="glass-subtle p-3 rounded-lg text-center"
                    >
                      <CheckCircle className="w-5 h-5 text-theme-50 mx-auto mb-2" />
                      <p className="text-xs text-white/80">{feature}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/services">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button text-lg px-8 py-4 bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 border-0"
                    >
                      Book a Caregiver
                    </motion.button>
                  </Link>
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button text-lg px-8 py-4"
                    >
                      Learn More
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Slider Cards */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-start pl-12">
            <div className="relative h-full flex items-center justify-center w-full">
              {slides.map((slide, index) => {
                const position = (index - currentSlide + slides.length) % slides.length;
                return (
                  <motion.div
                    key={slide.id}
                    className="absolute glass-card p-6 w-72 h-[420px] cursor-pointer overflow-hidden"
                    initial={false}
                    animate={{
                      x: position === 0 ? 0 : position === 1 ? 90 : position === 2 ? 180 : -90,
                      y: position === 0 ? 0 : 40,
                      scale: position === 0 ? 1 : 0.85,
                      opacity: position === 0 ? 1 : position === 1 ? 0.7 : position === 2 ? 0.4 : 0.2,
                      zIndex: position === 0 ? 10 : 10 - position,
                      rotateY: position === 0 ? 0 : -10,
                    }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setCurrentSlide(index)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                    
                    {/* Content with stronger background */}
                    <div className="relative z-10 bg-black/50 backdrop-blur-sm -mt-2 p-4 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {slide.title}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="glass-button p-3"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="glass-button p-3"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
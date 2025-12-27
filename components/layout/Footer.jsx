"use client";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, Clock, 
  Heart, ArrowRight, Shield, Award, 
  Users, CheckCircle, Activity,
  Facebook, Instagram, Linkedin, Youtube
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Baby Care", href: "/services" },
      { name: "Elderly Care", href: "/services" },
      { name: "Special Care", href: "/services" },
      { name: "24/7 Live-in Care", href: "/service/10" },
      { name: "Nursing at Home", href: "/service/11" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Our Caregivers", href: "/caregivers" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "FAQs", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact Us", href: "/contact" }
    ]
  };

  return (
    <footer className="relative mt-20 border-t border-white/10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none" />
      
      <div className="relative container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          
          {/* Column 1: Brand & Contact */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-3xl font-bold gradient-text bg-clip-text text-transparent">
                CareNest
              </h3>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Professional care services for your loved ones. Trusted by thousands of families across Bangladesh.
            </p>
            
            {/* Contact Info - Icons with solid backgrounds */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Call Us</p>
                  <a href="tel:+8801234567890" className="text-sm text-gray-400 hover:text-white">
                    +880 1234-567890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Email</p>
                  <a href="mailto:support@carenest.com" className="text-sm text-gray-400 hover:text-white">
                    support@carenest.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Address</p>
                  <p className="text-sm text-gray-400">Gulshan, Dhaka-1212<br/>Bangladesh</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Working Hours</p>
                  <p className="text-sm text-gray-400">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Our Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className="mt-8 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>10,000+ Happy Families</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>500+ Verified Caregivers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>5+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Verified & Trusted</p>
                  <p className="text-xs text-gray-400">Background Checked</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Certified Care</p>
                  <p className="text-xs text-gray-400">Professional Standards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Support & Newsletter */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Support
            </h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-lg border border-white/10">
              <h5 className="text-white font-bold mb-2">Stay Updated</h5>
              <p className="text-gray-400 text-sm mb-4">
                Get updates and special offers
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none transition text-sm"
                />
                <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(to right, #7aabb8, #4d8a9b)' }}
                >
                Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-white font-semibold">CareNest</span>. All rights reserved. 
            </p>

            {/* Social Links - WITH SOLID BACKGROUNDS */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-80 flex items-center justify-center transition-opacity"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs mr-2">Accepted:</span>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded bg-white/10 border border-white/20 text-gray-300 text-xs font-semibold">
                  bKash
                </div>
                <div className="px-3 py-1.5 rounded bg-white/10 border border-white/20 text-gray-300 text-xs font-semibold">
                  Nagad
                </div>
                <div className="px-3 py-1.5 rounded bg-white/10 border border-white/20 text-gray-300 text-xs font-semibold">
                  Card
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
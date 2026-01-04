"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Home, Briefcase, BookOpen, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const router = useRouter();
  
  // Use NextAuth session
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  const allNavLinks = [
    { name: "Home", href: "/", icon: Home, requireAuth: false },
    { name: "Services", href: "/services", icon: Briefcase, requireAuth: false },
    { name: "My Bookings", href: "/my-bookings", icon: BookOpen, requireAuth: true },
    { name: "Admin", href: "/admin", icon: Shield, requireAuth: true, adminOnly: true },
    { name: "Contact", href: "/contact", icon: Phone, requireAuth: false },
  ];

  // Filter links based on login status and admin role
  const navLinks = allNavLinks.filter(link => {
    if (link.adminOnly) {
      return isAdmin;
    }
    return !link.requireAuth || isLoggedIn;
  });

  // ✅ FIXED: Better logout handler
  const handleLogout = async () => {
    setShowProfileMenu(false);
    setIsOpen(false);
    
    try {
      // Use NextAuth's signOut with redirect false
      await signOut({ 
        redirect: false
      });
      
      // Manual navigation to home
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: force reload home page
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <div className="glass-card max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-theme-50 to-theme-200 rounded-xl flex items-center justify-center glow-effect"
              >
                <span className="text-2xl">🏥</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
                  CareNest
                </h1>
                <p className="text-xs text-white/60">Trusted Care Services</p>
              </div>
            </Link>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                      link.adminOnly 
                        ? 'text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{link.name}</span>
                    {link.adminOnly && (
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-400">
                        ADMIN
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right: Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 glass-card px-4 py-2"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isAdmin 
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                        : 'bg-gradient-to-br from-theme-50 to-theme-200'
                    }`}>
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-theme-900" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-white font-medium block">{session?.user?.name || "User"}</span>
                      {isAdmin && (
                        <span className="text-[10px] text-amber-400 font-semibold">ADMIN</span>
                      )}
                    </div>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glass-card overflow-hidden"
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden glass-button p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 right-0 bottom-0 w-80 glass-strong md:hidden overflow-y-auto"
              style={{ zIndex: 45 }}
            >
              <div className="p-6 pt-24">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-theme-50 to-theme-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text">CareNest</h2>
                    <p className="text-xs text-white/60">Trusted Care</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          link.adminOnly
                            ? 'text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                        {link.adminOnly && (
                          <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-400">
                            ADMIN
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  {!isLoggedIn ? (
                    <>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-5 py-3 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all font-medium"
                        >
                          Login
                        </motion.button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full glass-button"
                        >
                          Sign Up
                        </motion.button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 rounded-lg bg-white/5">
                        <p className="text-xs text-white/60 mb-1">Signed in as</p>
                        <p className="text-white font-medium">{session?.user?.name || "User"}</p>
                        <p className="text-xs text-white/60">{session?.user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-400">
                            ADMIN
                          </span>
                        )}
                      </div>
                      
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all font-medium"
                        >
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </motion.button>
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white bg-red-500/20 hover:bg-red-500/30 transition-all font-medium border border-red-500/30"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
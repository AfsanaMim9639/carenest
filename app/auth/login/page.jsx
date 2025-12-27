"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      console.log("Login data:", formData);
      
      // এখানে আপনার actual login API call হবে
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setIsLoading(false);
      // Success - redirect to home or dashboard
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md mt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text mb-2">CareNest</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to continue to your account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-400 focus:ring-offset-0"
                />
                <span className="text-white/70 text-sm">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ 
                    background: 'linear-gradient(to right, #7aabb8, #4d8a9b)',
                    boxShadow: '0 10px 25px -5px rgba(122, 171, 184, 0.3)'
                }}
                >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/40">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
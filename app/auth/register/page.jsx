"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  CreditCard, UserPlus, ArrowRight, CheckCircle, XCircle 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nid: "",
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  // Password validation
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password)
    };
    return validations;
  };

  const passwordValidations = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // NID validation
    if (!formData.nid || formData.nid.length < 10) {
      newErrors.nid = "Valid NID number is required (min 10 digits)";
    }

    // Name validation
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    // Contact validation
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.contact)) {
      newErrors.contact = "Valid Bangladesh phone number required (01XXXXXXXXX)";
    }

    // Password validation
    if (!isPasswordValid) {
      newErrors.password = "Password must meet all requirements";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors", {
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nid: formData.nid,
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed", {
          duration: 4000,
        });
        setErrors({ general: data.error });
        setIsLoading(false);
        return;
      }

      // Show success message
      toast.success("Account created successfully! Signing you in...", {
        duration: 3000,
        icon: "🎉",
      });

      // Auto login after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      // After successful auto-login
if (signInResult?.ok) {
  toast.success("Welcome to CareNest! Redirecting...", {
    duration: 2000,
    icon: "✨",
  });
  
  // Check if there's a callback URL in the query params
  const searchParams = new URLSearchParams(window.location.search);
  const callbackUrl = searchParams.get('callbackUrl') || '/services';
  
  
  setTimeout(() => {
    router.push(callbackUrl);
    router.refresh();
  }, 1000);
} else {
        // Registration success but login failed
        toast.error("Registration successful! Please login manually.", {
          duration: 4000,
        });
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1500);
      }

    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.", {
        duration: 4000,
      });
      setErrors({ general: "Registration failed. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl mt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text mb-2">CareNest</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60">Join us to access quality care services</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* NID Number */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  NID Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="nid"
                    required
                    value={formData.nid}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border ${
                      errors.nid ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="Enter NID number"
                  />
                </div>
                {errors.nid && (
                  <p className="text-red-400 text-xs mt-1">{errors.nid}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border ${
                      errors.name ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border ${
                      errors.email ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border ${
                      errors.contact ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                {errors.contact && (
                  <p className="text-red-400 text-xs mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg bg-white/5 border ${
                      errors.password ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg bg-white/5 border ${
                      errors.confirmPassword ? "border-red-500" : "border-white/10"
                    } text-white placeholder-white/30 focus:border-purple-400 focus:outline-none transition`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="text-white/70 text-sm font-medium mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidations.length ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={passwordValidations.length ? "text-green-400" : "text-white/60"}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidations.uppercase ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={passwordValidations.uppercase ? "text-green-400" : "text-white/60"}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidations.lowercase ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={passwordValidations.lowercase ? "text-green-400" : "text-white/60"}>
                      One lowercase letter
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-400 focus:ring-offset-0"
              />
              <label className="text-white/70 text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ background: 'linear-gradient(to right, #7aabb8, #4d8a9b)' }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign in
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
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Home, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");
  
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!paymentIntentId) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black flex items-center justify-center px-4 py-12">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Your booking has been confirmed
          </p>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-subtle p-6 rounded-lg mb-8"
        >
          <p className="text-theme-200 mb-2">Transaction ID</p>
          <p className="text-white font-mono text-sm break-all">
            {paymentIntentId}
          </p>
          
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Confirmation Email Sent</p>
                <p className="text-theme-300 text-sm">
                  Check your inbox for booking details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Booking Confirmed</p>
                <p className="text-theme-300 text-sm">
                  Our team will contact you shortly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Payment Processed</p>
                <p className="text-theme-300 text-sm">
                  Your payment has been successfully processed
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/my-bookings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-8 py-3 bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FileText size={20} />
              View My Bookings
              <ArrowRight size={20} />
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-8 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Home size={20} />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-theme-300 text-sm mt-8"
        >
          Need help? Contact us at{" "}
          <a href="mailto:support@carenest.com" className="text-theme-100 hover:underline">
            support@carenest.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
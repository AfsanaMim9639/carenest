'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { ArrowLeft, Lock, CheckCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const bookingDataParam = searchParams.get('data');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!bookingDataParam) {
      toast.error('No booking data found');
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(bookingDataParam));
      setBookingDetails(parsed);
      createPaymentIntent(parsed);
    } catch (error) {
      console.error('Failed to parse booking data:', error);
      toast.error('Invalid booking data');
    }
  }, [bookingDataParam]);

  const createPaymentIntent = async (data) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingData: data })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setClientSecret(result.clientSecret);
    } catch (error) {
      console.error('Payment intent error:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-400 mx-auto mb-4"></div>
          <p className="text-theme-200">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#a3c4e0',
        colorBackground: '#0a0e12',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-900 via-theme-800 to-black py-12 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-theme-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-theme-300/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-theme-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to booking</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold gradient-text mb-6">
                Booking Summary
              </h2>

              <div className="space-y-4">
                <SummaryItem
                  label="Service"
                  value={bookingDetails?.serviceName}
                />
                <SummaryItem
                  label="Category"
                  value={bookingDetails?.category}
                />
                <SummaryItem
                  label="Duration"
                  value={`${bookingDetails?.duration} ${bookingDetails?.durationType}`}
                />
                <SummaryItem
                  label="Location"
                  value={`${bookingDetails?.area}, ${bookingDetails?.city}, ${bookingDetails?.district}`}
                />
                <SummaryItem
                  label="Contact"
                  value={bookingDetails?.phone}
                />
                
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-white">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold gradient-text">
                      ৳{bookingDetails?.totalCost?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-theme-300">
                    Payment will be processed securely via Stripe
                  </p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={20} className="text-green-400" />
                Secure Payment
              </h3>
              <div className="space-y-3 text-sm text-theme-200">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>We never store your card details</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>100% money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard size={24} className="text-theme-100" />
              Payment Details
            </h2>

            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                  bookingDetails={bookingDetails}
                  clientSecret={clientSecret}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ bookingDetails, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
      router.push(`/booking-success?payment_intent=${paymentIntent.id}`);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-theme-100/50 transition-all"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-theme-900 border-t-transparent"></div>
            Processing...
          </span>
        ) : (
          `Pay ৳${bookingDetails?.totalCost?.toLocaleString()}`
        )}
      </button>

      <p className="text-xs text-center text-theme-300">
        By confirming payment, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-white/5">
      <span className="text-theme-200 text-sm">{label}</span>
      <span className="text-white font-medium text-sm text-right">{value}</span>
    </div>
  );
}
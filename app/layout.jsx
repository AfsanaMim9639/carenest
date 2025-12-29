import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareNest - Trusted Care Services",
  description: "Professional babysitting, elderly care, and special care services for your loved ones",
  keywords: "babysitting, elderly care, caretaker, home care services, Bangladesh",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Navbar />
          {children}
          <Footer />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                background: 'rgba(17, 24, 39, 0.95)',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                fontSize: '14px',
                fontWeight: '500',
              },
              // Success toast
              success: {
                duration: 3000,
                style: {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                },
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              // Error toast
              error: {
                duration: 4000,
                style: {
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
              // Loading toast
              loading: {
                style: {
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#a855f7',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
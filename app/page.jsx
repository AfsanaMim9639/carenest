import Banner from "@/components/home/Banner";
import AboutSection from "@/components/home/AboutSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import Testimonials from "@/components/home/Testimonials";

export const metadata = {
  title: "CareNest - Trusted Care Services | Baby Care, Elderly Care & Special Care",
  description: "Professional babysitting, elderly care, and special care services in Bangladesh. Book certified caregivers for your loved ones today.",
  keywords: "babysitting, elderly care, caretaker, home care services, Bangladesh, Dhaka, professional caregivers",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner with Slider */}
      <Banner />

      {/* About Section */}
      <AboutSection />

      {/* Services Overview */}
      <ServicesOverview />

      {/* Testimonials & Success Metrics */}
      <Testimonials />
    </main>
  );
}
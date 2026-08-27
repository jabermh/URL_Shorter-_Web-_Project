import PublicNavbar from "../components/PublicNavbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import DashboardPreview from "../components/DashboardPreview";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <PublicNavbar />

      <Hero />

      <DashboardPreview />

      <Features />

      <HowItWorks />

      <CTA />

      <Footer />
    </div>
  );
}
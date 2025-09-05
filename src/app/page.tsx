import EmergencyContact from "@/components/landing/EmergencyContact";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import RiskMap from "@/components/landing/RiskMap";
import Symptoms from "@/components/landing/Symptoms";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Symptoms />
        <RiskMap/>
        <Features/>
        <EmergencyContact/>
      </main>
      <Footer />
    </>
  );
}

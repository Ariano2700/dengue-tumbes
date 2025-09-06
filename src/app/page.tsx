import { Metadata } from "next";
import EmergencyContact from "@/components/landing/EmergencyContact";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import RiskMap from "@/components/landing/RiskMap";
import Symptoms from "@/components/landing/Symptoms";
import LenisScroll from "@/components/landing/LenisScroll";

export const metadata: Metadata = {
  other: {
    "geo.region": "PE-TUM",
    "geo.placename": "Tumbes, Perú",
    "geo.position": "-3.5669;-80.4515",
    ICBM: "-3.5669, -80.4515",
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Inicio",
                  item: "https://dengue-tumbes.vercel.app/",
                },
              ],
            },
          ]),
        }}
      />
      <LenisScroll />
      <Header />
      <main
        role="main"
        aria-label="Contenido principal del sistema Dengue Cero"
      >
        <Hero />
        <Symptoms />
        <RiskMap />
        <Features />
        <EmergencyContact />
      </main>
      <Footer />
    </>
  );
}

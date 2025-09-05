import { Metadata } from "next";
import EmergencyContact from "@/components/landing/EmergencyContact";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import RiskMap from "@/components/landing/RiskMap";
import Symptoms from "@/components/landing/Symptoms";
import { organizationSchema, websiteSchema, medicalWebPageSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Dengue Cero Tumbes | Sistema Oficial de Prevención del Dengue - MINSA",
  description: "Sistema web oficial del MINSA para prevención, autoevaluación de síntomas y monitoreo epidemiológico del dengue en Tumbes, Perú. Protege a tu comunidad con herramientas digitales de salud pública.",
  keywords: [
    "dengue Tumbes",
    "prevención dengue Perú",
    "autoevaluación síntomas dengue",
    "MINSA dengue",
    "mosquito Aedes aegypti",
    "fiebre dengue Tumbes",
    "sistema salud pública",
    "epidemiología dengue",
    "monitoreo casos dengue",
    "salud comunitaria Tumbes",
    "enfermedades vectoriales"
  ],
  openGraph: {
    title: "Dengue Cero Tumbes | Sistema Oficial de Prevención del Dengue",
    description: "Protege a tu comunidad del dengue con autoevaluación de síntomas, mapas de riesgo y herramientas de prevención. Sistema oficial del MINSA para Tumbes, Perú.",
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Dengue Cero Tumbes - Prevención del Dengue con Tecnología',
      }
    ],
    type: 'website',
    locale: 'es_PE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dengue Cero Tumbes | Prevención del Dengue',
    description: 'Sistema oficial del MINSA para autoevaluación de síntomas y prevención del dengue en Tumbes, Perú.',
    images: ['/twitter-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'geo.region': 'PE-TUM',
    'geo.placename': 'Tumbes, Perú',
    'geo.position': '-3.5669;-80.4515',
    'ICBM': '-3.5669, -80.4515',
  }
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationSchema,
            websiteSchema,
            medicalWebPageSchema,
            faqSchema,
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Inicio",
                  "item": "https://dengue-tumbes.vercel.app/"
                }
              ]
            }
          ])
        }}
      />
      <Header />
      <main role="main" aria-label="Contenido principal del sistema Dengue Cero">
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

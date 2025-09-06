import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Dengue Cero Tumbes | Sistema de Prevención y Autoevaluación",
    template: "%s | Dengue Cero Tumbes",
  },
  description:
    "Sistema web oficial para prevención, autoevaluación de síntomas y monitoreo de casos de dengue en la región Tumbes, Perú. Protege a tu comunidad del dengue con herramientas digitales.",
  keywords: [
    "dengue",
    "prevención dengue",
    "síntomas dengue",
    "autoevaluación dengue",
    "Tumbes",
    "Perú",
    "MINSA",
    "salud pública",
    "mosquito Aedes aegypti",
    "fiebre dengue",
    "epidemiología",
    "monitoreo casos dengue",
    "sistema salud",
    "prevención enfermedades vectoriales",
    "salud comunitaria",
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
    "enfermedades vectoriales",
  ],
  authors: [{ name: "Ariano Alban" }, { name: "Dengue Cero Team" }],
  creator: "Sistema de Salud Pública Tumbes",
  publisher: "Ariano Alban",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "https://dengue-tumbes.vercel.app"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "es-PE": "/",
      es: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    title:
      "Dengue Cero Tumbes | Sistema de Prevención y Autoevaluación de Dengue",
    description:
      "Sistema web oficial para prevención, autoevaluación de síntomas y monitoreo de casos de dengue en la región Tumbes, Perú.",
    siteName: "Dengue Cero Tumbes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dengue Cero Tumbes - Sistema de Prevención del Dengue",
      },
      {
        url: "/og-image-square.jpg",
        width: 800,
        height: 800,
        alt: "Dengue Cero Tumbes - Prevención del Dengue en Tumbes, Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dengue Cero Tumbes | Sistema de Prevención del Dengue",
    description:
      "Protege a tu comunidad del dengue con autoevaluación de síntomas y herramientas de prevención. Sistema oficial del MINSA para Tumbes, Perú.",
    images: ["/twitter-image.jpg"],
    creator: "@MinsaPeru",
    site: "@DengueCeroTumbes",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    other: {
      "msvalidate.01": process.env.BING_VERIFICATION_ID || "",
    },
  },
  category: "health",
  classification: "Public Health System",
  other: {
    "theme-color": "#2563eb",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Dengue Cero",
    "application-name": "Dengue Cero Tumbes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for initial page load */
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
          `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Dengue Cero Tumbes",
              url: "https://dengue-tumbes.vercel.app",
              description:
                "Sistema web oficial para prevención, autoevaluación de síntomas y monitoreo de casos de dengue en la región Tumbes, Perú.",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "PEN",
              },
              publisher: {
                "@type": "Organization",
                name: "MINSA - Ministerio de Salud del Perú",
                url: "https://www.gob.pe/minsa",
              },
              author: {
                "@type": "Organization",
                name: "Sistema de Salud Pública Tumbes",
              },
              inLanguage: "es-PE",
              availableLanguage: ["es", "es-PE"],
              featureList: [
                "Autoevaluación de síntomas de dengue",
                "Mapa de casos y zonas de riesgo",
                "Información de prevención",
                "Monitoreo epidemiológico",
                "Contacto con servicios de salud",
              ],
              screenshot: "https://dengue-tumbes.vercel.app/screenshot.jpg",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "120",
              },
              potentialAction: {
                "@type": "UseAction",
                target: "https://dengue-tumbes.vercel.app/registrarse",
                name: "Comenzar Autoevaluación",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}
      >
        <ReduxProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

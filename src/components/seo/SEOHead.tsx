import Head from 'next/head'
import { organizationSchema } from '@/lib/structured-data'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  breadcrumbs?: { name: string; url: string }[]
  healthContent?: {
    medicalCondition?: string
    symptoms?: string[]
    treatments?: string[]
    riskFactors?: string[]
    lastReviewed?: string
  }
}

const SEOHead: React.FC<SEOProps> = ({
  title = 'Dengue Cero Tumbes | Sistema de Prevención del Dengue',
  description = 'Sistema web oficial para prevención, autoevaluación de síntomas y monitoreo de casos de dengue en la región Tumbes, Perú.',
  keywords = [],
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  breadcrumbs = [],
  healthContent
}) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://dengue-tumbes.vercel.app'
  const fullUrl = `${baseUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null

  // Generate medical content schema if health content is provided
  const medicalSchema = healthContent ? {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": title,
    "url": fullUrl,
    "description": description,
    "about": healthContent.medicalCondition ? {
      "@type": "MedicalCondition",
      "name": healthContent.medicalCondition,
      "signOrSymptom": healthContent.symptoms?.map(symptom => ({
        "@type": "MedicalSymptom",
        "name": symptom
      })) || [],
      "riskFactor": healthContent.riskFactors || [],
      "possibleTreatment": healthContent.treatments?.map(treatment => ({
        "@type": "MedicalTherapy",
        "name": treatment
      })) || []
    } : undefined,
    "lastReviewed": healthContent.lastReviewed || new Date().toISOString(),
    "reviewedBy": organizationSchema,
    "medicalAudience": [
      {
        "@type": "PatientsAudience",
        "audienceType": "patient"
      }
    ]
  } : null

  // Combine all keywords
  const allKeywords = [
    'dengue',
    'prevención dengue',
    'síntomas dengue',
    'Tumbes',
    'Perú',
    'MINSA',
    'salud pública',
    ...keywords,
    ...tags
  ].join(', ')

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || 'MINSA Tumbes'} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="3 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="PE-TUM" />
      <meta name="geo.placename" content="Tumbes, Perú" />
      <meta name="geo.position" content="-3.5669;-80.4515" />
      <meta name="ICBM" content="-3.5669, -80.4515" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Imagen representativa`} />
      <meta property="og:site_name" content="Dengue Cero Tumbes" />
      <meta property="og:locale" content="es_PE" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:creator" content="@MinsaPeru" />
      <meta property="twitter:site" content="@DengueCeroTumbes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Alternate languages */}
      <link rel="alternate" hrefLang="es" href={fullUrl} />
      <link rel="alternate" hrefLang="es-PE" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Health and Medical specific meta tags */}
      {healthContent && (
        <>
          <meta name="medical-content" content="true" />
          <meta name="health-topic" content={healthContent.medicalCondition} />
          {healthContent.lastReviewed && (
            <meta name="last-medical-review" content={healthContent.lastReviewed} />
          )}
        </>
      )}
      
      {/* Structured Data */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      )}
      
      {medicalSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalSchema)
          }}
        />
      )}
      
      {/* Page-specific schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": fullUrl,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Dengue Cero Tumbes",
              "url": baseUrl
            },
            "inLanguage": "es-PE",
            "potentialAction": {
              "@type": "ReadAction",
              "target": fullUrl
            }
          })
        }}
      />
    </Head>
  )
}

export default SEOHead

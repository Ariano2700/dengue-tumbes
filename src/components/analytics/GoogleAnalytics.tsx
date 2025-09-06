'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GoogleAnalytics: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [GA_TRACKING_ID, setGA_TRACKING_ID] = useState<string | undefined>()

  useEffect(() => {
    setIsMounted(true)
    // Get the tracking ID from environment variables on the client side
    setGA_TRACKING_ID(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
  }, [])

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && GA_TRACKING_ID) {
      // Track page views
      window.gtag = window.gtag || function() {
        (window.dataLayer = window.dataLayer || []).push(arguments)
      }
      
      // Set up enhanced measurement
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
        // Health-specific tracking
        custom_map: {
          'custom_parameter_1': 'dengue_risk_level',
          'custom_parameter_2': 'symptom_severity',
          'custom_parameter_3': 'evaluation_result'
        }
      })
    }
  }, [GA_TRACKING_ID, isMounted])

  // Track health-related events
  const trackHealthEvent = (eventName: string, parameters: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'health_assessment',
        event_label: 'dengue_evaluation',
        ...parameters
      })
    }
  }

  // Track user engagement with prevention content
  const trackPreventionEngagement = (contentType: string, action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'prevention_engagement', {
        event_category: 'education',
        content_type: contentType,
        action: action,
        custom_parameter_1: 'prevention_education'
      })
    }
  }

  if (!GA_TRACKING_ID || !isMounted) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
            
            // Custom health tracking events
            gtag('event', 'page_view', {
              event_category: 'health_system'
            });
          `
        }}
      />
    </>
  )
}

export default GoogleAnalytics

// Utility functions for health-specific tracking
export const trackSymptomAssessment = (severity: string, symptoms: string[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'symptom_assessment', {
      event_category: 'health_assessment',
      severity: severity,
      symptoms_count: symptoms.length,
      symptoms_list: symptoms.join(','),
      custom_parameter_2: severity
    })
  }
}

export const trackPreventionAction = (action: string, method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'prevention_action', {
      event_category: 'prevention',
      action: action,
      method: method,
      custom_parameter_1: 'prevention_engagement'
    })
  }
}

export const trackEmergencyContact = (contactType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'emergency_contact', {
      event_category: 'emergency',
      contact_type: contactType,
      urgency: 'high'
    })
  }
}

export const trackMapInteraction = (action: string, region?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'map_interaction', {
      event_category: 'epidemiology',
      action: action,
      region: region || 'tumbes',
      custom_parameter_1: 'map_engagement'
    })
  }
}

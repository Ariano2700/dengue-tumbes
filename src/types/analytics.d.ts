// Google Analytics Types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any
      }
    ) => void
    dataLayer: any[]
  }
}

export interface GoogleAnalyticsEvent {
  event_category?: string
  event_label?: string
  value?: number
  custom_parameter_1?: string
  custom_parameter_2?: string
  custom_parameter_3?: string
  [key: string]: any
}

export interface HealthTrackingEvent extends GoogleAnalyticsEvent {
  severity?: string
  symptoms_count?: number
  symptoms_list?: string
  evaluation_result?: string
  dengue_risk_level?: string
}

export interface PreventionTrackingEvent extends GoogleAnalyticsEvent {
  content_type?: string
  action?: string
  method?: string
}

export interface EmergencyTrackingEvent extends GoogleAnalyticsEvent {
  contact_type?: string
  urgency?: string
}

export interface MapTrackingEvent extends GoogleAnalyticsEvent {
  action?: string
  region?: string
}

export {}

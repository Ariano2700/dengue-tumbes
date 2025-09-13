"use client";

import { Phone } from "lucide-react";

function EmergencyContact() {
  const handleEmergencyCall = () => {
    window.location.href = "tel:106";
  };

  const handleEmergencyCall2 = () => {
    window.location.href = "tel:+51913647627";
  };

  const handleHealthCenterCall = () => {
    // Abrir Google Maps en una nueva pestaña
    window.open("https://maps.app.goo.gl/vgxULsWwXy5CDocEA", "_blank");
  };
  return (
    <section
      className="py-12 bg-[var(--color-primary)]"
      role="region"
      aria-labelledby="emergency-contact-title"
      itemScope
      itemType="https://schema.org/EmergencyService"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="mb-4"
            role="img"
            aria-label="Icono de teléfono para contacto de emergencia"
          >
            <Phone
              className="w-12 h-12 text-white mx-auto"
              aria-hidden="true"
            />
          </div>
          <h2
            id="emergency-contact-title"
            className="text-2xl font-bold text-white mb-2"
            itemProp="name"
          >
            ¿Tienes síntomas graves?
          </h2>
          <p className="text-white/90 mb-6" role="text" itemProp="description">
            Si presentas signos y síntomas de dengue con señales de alarma o
            dengue grave, busca atención médica inmediata
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            role="group"
            aria-label="Opciones de contacto de emergencia"
          >
            <button
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 flex items-center justify-center p-3 rounded-xl transition-all ease-in duration-200 cursor-pointer transform hover:scale-105"
              onClick={handleEmergencyCall}
              type="button"
              aria-label="Llamar al número de emergencia 106"
              title="Llamar emergencias médicas - Número gratuito 106"
              itemProp="telephone"
              itemScope
              itemType="https://schema.org/ContactPoint"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              <span>
                Llamar Emergencias: <strong>106</strong>
              </span>
            </button>

            <button
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 flex items-center justify-center p-3 rounded-xl transition-all ease-in duration-200 cursor-pointer transform hover:scale-105"
              onClick={handleEmergencyCall2}
              type="button"
              aria-label="Llamar al número de emergencia 913647627"
              title="Llamar emergencias médicas - Número gratuito 913647627"
              itemProp="telephone"
              itemScope
              itemType="https://schema.org/ContactPoint"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              <span>
                Llamar Emergencias - SAMU: <strong>913647627</strong>
              </span>
            </button>
            <button
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 flex items-center justify-center p-3 rounded-xl transition-all ease-in duration-200 cursor-pointer transform hover:scale-105"
              onClick={handleHealthCenterCall}
              type="button"
              aria-label="Llamar al Centro de Salud de Tumbes"
              title="Contactar Centro de Salud de Tumbes para atención médica"
              itemProp="telephone"
              itemScope
              itemType="https://schema.org/MedicalOrganization"
            >
              <span itemProp="name">Acudir al centro de salud más cercano</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default EmergencyContact;

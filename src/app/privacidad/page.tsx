import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import LenisScroll from "@/components/landing/LenisScroll";

function PrivacyPolicy() {
  return (
    <>
      <LenisScroll />
      <Header />
      <main
        role="main"
        aria-label="Política de privacidad del sistema Dengue Cero"
        className="px-6 py-12 max-w-4xl mx-auto text-gray-800"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
        <p className="mb-4 leading-relaxed">
          En Dengue Cero Tumbes, valoramos y respetamos tu privacidad. Esta política de privacidad explica cómo recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestro sistema.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Información que Recopilamos</h2>
        <p className="mb-4 leading-relaxed">
          Recopilamos información personal que tú nos proporcionas directamente, como tu nombre, correo electrónico, número de teléfono, DNI y cualquier dato ingresado durante las autoevaluaciones. No recopilamos información técnica como tu dirección IP.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Uso de la Información</h2>
        <p className="mb-4 leading-relaxed">
          Utilizamos tu información para los siguientes propósitos:
        </p>
        <ul className="list-disc list-inside mb-4 leading-relaxed">
          <li>Proporcionar y mejorar los servicios del sistema.</li>
          <li>Personalizar tu experiencia y ofrecer recomendaciones basadas en tus datos.</li>
          <li>Monitorear y analizar el uso del sistema para mejorar su funcionalidad.</li>
          <li>Contactarte con información relevante sobre el sistema o actualizaciones importantes.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Protección de tu Información</h2>
        <p className="mb-4 leading-relaxed">
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados, pérdida, uso indebido o divulgación. Sin embargo, ningún sistema es completamente seguro, por lo que no podemos garantizar la seguridad absoluta de tus datos.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Compartición de Información</h2>
        <p className="mb-4 leading-relaxed">
          Solo compartimos tu información personal con el Ministerio de Salud (MINSA) de Tumbes para fines relacionados con la prevención y el monitoreo del dengue. No compartimos tu información con terceros bajo ninguna otra circunstancia.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Tus Derechos</h2>
        <p className="mb-4 leading-relaxed">
          Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Si deseas ejercer estos derechos, contáctanos a través de nuestro correo electrónico <a href="mailto:denguecerotumbes@gmail.com" className="text-blue-600 hover:underline">denguecerotumbes@gmail.com</a>.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cambios a esta Política</h2>
        <p className="mb-4 leading-relaxed">
          Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales. Te notificaremos sobre cualquier cambio importante a través del sistema o por correo electrónico.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contáctanos</h2>
        <p className="leading-relaxed">
          Si tienes preguntas o inquietudes sobre esta política de privacidad, no dudes en escribirnos a <a href="mailto:denguecerotumbes@gmail.com" className="text-blue-600 hover:underline">denguecerotumbes@gmail.com</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
export default PrivacyPolicy;
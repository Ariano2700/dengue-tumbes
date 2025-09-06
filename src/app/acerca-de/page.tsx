import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import LenisScroll from "@/components/landing/LenisScroll";

function AboutTo() {
  return (
    <>
      <LenisScroll />
      <Header />
      <main
        role="main"
        aria-label="Contenido principal acerca del sistema Dengue Cero"
        className="px-6 py-12 max-w-4xl mx-auto text-gray-800"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Acerca de Dengue Cero Tumbes
        </h1>
        <p className="mb-4 leading-relaxed">
          Dengue Cero Tumbes es un sistema web diseñado para combatir el dengue en
          la región de Tumbes, Perú. Este proyecto tiene como objetivo principal
          proporcionar herramientas digitales que permitan a la comunidad
          prevenir, identificar y monitorear casos de dengue de manera eficiente y
          accesible.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Nuestra Misión
        </h2>
        <p className="mb-4 leading-relaxed">
          Nuestra misión es proteger a la comunidad tumbesina del dengue mediante
          el uso de tecnología innovadora. Queremos empoderar a los ciudadanos con
          información y herramientas que les permitan tomar decisiones informadas
          sobre su salud y la de sus familias.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          ¿Qué Ofrecemos?
        </h2>
        <ul className="list-disc list-inside mb-4 leading-relaxed">
          <li>Autoevaluaciones rápidas para identificar síntomas de dengue.</li>
          <li>
            Un mapa interactivo que muestra las zonas de riesgo y casos reportados
            en tiempo real.
          </li>
          <li>
            Un historial personal para que los usuarios puedan consultar sus
            evaluaciones pasadas.
          </li>
          <li>
            Consejos prácticos y educativos sobre cómo prevenir el dengue.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          ¿Por Qué Tumbes?
        </h2>
        <p className="mb-4 leading-relaxed">
          La región de Tumbes, debido a su clima tropical y su ubicación
          geográfica, es especialmente vulnerable al dengue. Este sistema fue
          creado específicamente para abordar las necesidades de esta región,
          proporcionando soluciones adaptadas a su contexto único.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Compromiso con la Comunidad
        </h2>
        <p className="mb-4 leading-relaxed">
          En Dengue Cero Tumbes, creemos que la prevención comienza con la
          educación y el acceso a la información. Estamos comprometidos a trabajar
          junto con las autoridades locales, los profesionales de la salud y la
          comunidad para reducir la incidencia del dengue y mejorar la calidad de
          vida de todos los tumbesinos.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Contáctanos
        </h2>
        <p className="leading-relaxed">
          Si tienes preguntas, sugerencias o deseas colaborar con nosotros, no
          dudes en escribirnos a{" "}
          <a
            href="mailto:denguecerotumbes@gmail.com"
            className="text-blue-600 hover:underline"
          >
            denguecerotumbes@gmail.com
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
export default AboutTo;
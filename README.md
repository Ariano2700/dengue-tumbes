# Dengue Cero Tumbes

Dengue Cero Tumbes es un sistema web diseñado para la prevención, autoevaluación de síntomas y monitoreo de casos de dengue en la región de Tumbes, Perú. Este proyecto combina herramientas digitales modernas para proteger a la comunidad del dengue.

## Funcionalidades principales

### 1. **Autoevaluación de síntomas**
La funcionalidad de autoevaluación permite a los usuarios evaluar rápidamente si presentan síntomas relacionados con el dengue. Incluye:
- **Formulario interactivo**: Los usuarios responden preguntas sobre síntomas como fiebre, dolor muscular, náuseas, entre otros.
- **Resultados inmediatos**: Al completar el formulario, el sistema genera un resultado indicando el nivel de riesgo.
- **Recomendaciones personalizadas**: Basadas en los resultados, se ofrecen consejos sobre los pasos a seguir, como buscar atención médica o tomar medidas preventivas.
- **Historial de autoevaluaciones**: Cada evaluación se guarda para que el usuario pueda consultarla más adelante.

### 2. **Historial**
El historial proporciona a los usuarios un registro detallado de sus interacciones con el sistema. Incluye:
- **Listado de autoevaluaciones pasadas**: Los usuarios pueden ver todas las autoevaluaciones realizadas, junto con sus resultados y fechas.
- **Filtros avanzados**: Permite buscar evaluaciones específicas por fecha o nivel de riesgo.
- **Detalles de cada evaluación**: Al seleccionar una evaluación, se muestra información detallada sobre las respuestas proporcionadas y las recomendaciones dadas.

### 3. **Mapa de casos y zonas de riesgo**
El mapa interactivo es una herramienta clave para visualizar la situación del dengue en la región. Incluye:
- **Zonas de riesgo**: Identifica áreas con alta incidencia de casos de dengue.
- **Datos en tiempo real**: Muestra información actualizada sobre los casos reportados.
- **Filtros personalizables**: Los usuarios pueden ajustar la vista del mapa según el rango de fechas, ubicación y nivel de riesgo.
- **Interactividad**: Al hacer clic en una zona, se muestran detalles adicionales como el número de casos y las medidas recomendadas.

### 4. **Gestión de perfiles de usuario**
- Los usuarios pueden completar y actualizar su perfil, incluyendo información personal como nombres, DNI y teléfono.
- Se muestra el estado del perfil (completo o incompleto) y la fecha de registro.

### 5. **Sistema de autenticación**
- Inicio de sesión con Google mediante `next-auth`.
- Gestión de sesiones seguras con JWT.

### 6. **Panel de control (Dashboard)**
El dashboard es el centro de operaciones del sistema, diseñado para proporcionar una experiencia intuitiva y funcional. Incluye:
- **Estadísticas rápidas**: Muestra información clave como el número de autoevaluaciones realizadas, zonas de riesgo identificadas y actividades recientes.
- **Autoevaluación**: Acceso directo para realizar autoevaluaciones de síntomas.
- **Historial**: Permite a los usuarios consultar sus autoevaluaciones pasadas, con filtros para buscar por fecha o resultados específicos.
- **Mapa de casos**: Una vista interactiva que permite explorar las zonas afectadas por el dengue, con opciones para filtrar por tiempo y ubicación.
- **Consejos de salud**: Proporciona recomendaciones prácticas para prevenir el dengue y mantenerse seguro.
- **Navegación responsiva**: Optimizado para dispositivos móviles y de escritorio, con un diseño que se adapta a diferentes tamaños de pantalla.
- **Gestión de perfil**: Acceso rápido para actualizar información personal y verificar el estado del perfil.

### 7. **Información educativa**
- Sección dedicada a la prevención del dengue, incluyendo síntomas y medidas de protección.

## Tecnologías utilizadas

- **Next.js**: Framework para aplicaciones web modernas.
- **Redux Toolkit**: Gestión del estado global de la aplicación.
- **Prisma**: ORM para la interacción con la base de datos.
- **Tailwind CSS**: Framework de estilos para un diseño moderno y responsivo.
- **Lucide Icons**: Iconos SVG para mejorar la experiencia visual.

## Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Ariano2700/dengue-tumbes.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto.
   - Agrega las siguientes variables:
     ```env
     NEXTAUTH_URL=http://localhost:3000
     GOOGLE_CLIENT_ID=tu_client_id
     GOOGLE_CLIENT_SECRET=tu_client_secret
     NEXTAUTH_SECRET=tu_secreto
     ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue

El proyecto está optimizado para ser desplegado en [Vercel](https://vercel.com/):

1. Conecta tu repositorio con Vercel.
2. Configura las variables de entorno en el panel de Vercel.
3. Realiza un despliegue automático al hacer push a la rama `main`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerir mejoras o reportar problemas.

## Licencia

Este proyecto está bajo la licencia MIT.

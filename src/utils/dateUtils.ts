// Utilidades para manejo de fechas en zona horaria de Perú

/**
 * Convierte una fecha UTC a fecha en zona horaria de Perú
 * @param date - Fecha en UTC (string o Date)
 * @returns Date object en zona horaria de Perú
 */
export function toPeruDate(date: string | Date): Date {
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  
  // Perú está en UTC-5 (no cambia con horario de verano)
  const peruOffset = -5 * 60; // -5 horas en minutos
  const utcOffset = utcDate.getTimezoneOffset(); // offset de la zona horaria local
  
  // Ajustar la diferencia para obtener la hora de Perú
  const peruTime = new Date(utcDate.getTime() + (utcOffset - peruOffset) * 60 * 1000);
  
  return peruTime;
}

/**
 * Formatea una fecha para mostrar en la interfaz de usuario en formato peruano
 * @param date - Fecha en UTC (string o Date)
 * @returns Objeto con fecha y hora formateadas
 */
export function formatPeruDateTime(date: string | Date) {
  const peruDate = new Date(date);
  
  // Obtener la fecha en zona horaria de Perú
  const peruDateString = peruDate.toLocaleString('en-US', {
    timeZone: 'America/Lima'
  });
  
  const peruDateObj = new Date(peruDateString);
  
  // Formatear manualmente para garantizar DD/MM/YYYY
  const day = peruDateObj.getDate().toString().padStart(2, '0');
  const month = (peruDateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = peruDateObj.getFullYear();
  
  const formattedDate = `${day}/${month}/${year}`;
  
  // Formatear hora
  const formattedTime = peruDateObj.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return {
    date: formattedDate,
    time: formattedTime,
    full: `${formattedDate} - ${formattedTime}`
  };
}

/**
 * Calcula los días transcurridos desde una fecha hasta ahora (en zona horaria de Perú)
 * @param date - Fecha en UTC (string o Date)
 * @returns Número de días transcurridos
 */
export function getDaysAgoInPeru(date: string | Date): number {
  const now = new Date();
  const peruNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const peruDate = new Date(new Date(date).toLocaleString('en-US', { timeZone: 'America/Lima' }));
  
  const diffTime = peruNow.getTime() - peruDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Obtiene el inicio del mes actual en zona horaria de Perú
 * @returns Date object con el primer día del mes actual en Perú
 */
export function getStartOfMonthInPeru(): Date {
  const now = new Date();
  const peruNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  
  return new Date(peruNow.getFullYear(), peruNow.getMonth(), 1);
}

/**
 * Formatea los días transcurridos en texto legible
 * @param daysAgo - Número de días
 * @returns String formateado
 */
export function formatDaysAgo(daysAgo: number): string {
  if (daysAgo === 0) return 'Hoy';
  if (daysAgo === 1) return 'Ayer';
  return `Hace ${daysAgo} días`;
}

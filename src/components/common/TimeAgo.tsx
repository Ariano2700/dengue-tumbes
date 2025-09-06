'use client';

import { useEffect, useState } from 'react';

interface TimeAgoProps {
  dateString: string;
}

const formatTimeAgo = (dateString: string, now: Date): string => {
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return 'Hace 1 semana';
  return `Hace ${diffInWeeks} semanas`;
};

export function TimeAgo({ dateString }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      setTimeAgo(formatTimeAgo(dateString, now));
    };
    
    updateTimeAgo();
    
    // Update every minute
    const interval = setInterval(updateTimeAgo, 60000);
    
    return () => clearInterval(interval);
  }, [dateString]);
  
  return <span>{timeAgo}</span>;
}

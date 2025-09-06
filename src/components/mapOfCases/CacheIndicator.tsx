import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CacheIndicator() {
  const { lastFetch, isLoading, cacheTimeout } = useSelector((state: RootState) => state.map);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  
  useEffect(() => {
    // Set initial time and update periodically
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!lastFetch || currentTime === null) {
    return (
      <div className="hidden items-center gap-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
        <WifiOff className="w-3 h-3" />
        Sin datos
      </div>
    );
  }

  const timeElapsed = currentTime - lastFetch;
  const isExpired = timeElapsed > cacheTimeout;
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="hidden items-center gap-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs animate-pulse">
        <Wifi className="w-3 h-3" />
        Cargando...
      </div>
    );
  }

  return (
    <div className={`hidden items-center gap-2 px-2 py-1 rounded-md text-xs ${
      isExpired 
        ? 'bg-yellow-100 text-yellow-600' 
        : 'bg-green-100 text-green-600'
    }`}>
      <Clock className="w-3 h-3" />
      {isExpired ? 'Cache expirado' : 'Cache válido'} - {formatTime(timeElapsed)}
    </div>
  );
}

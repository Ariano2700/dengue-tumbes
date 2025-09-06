import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchMapData, 
  setFilters, 
  selectMapData, 
  selectMapFilters, 
  selectMapLoading, 
  selectMapError,
  selectShouldFetchData 
} from '@/store/slices/mapSlice';
import { useAuth } from './useAuth';

interface MapFilters {
  dateFilter: 'lastWeek' | 'lastMonth' | '3months' | '1year' | 'all';
  riskLevel: 'all' | 'low' | 'medium' | 'high';
}

interface UseMapDataReturn {
  points: any[];
  zoneStats: any[];
  filters: any;
  metadata: any;
  isLoading: boolean;
  error: string | null;
  refetch: (newFilters?: Partial<MapFilters>) => Promise<void>;
}

export function useMapDataCached(initialFilters?: Partial<MapFilters>): UseMapDataReturn {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  
  const data = useSelector(selectMapData);
  const currentFilters = useSelector(selectMapFilters);
  const isLoading = useSelector(selectMapLoading);
  const error = useSelector(selectMapError);

  const filtersToUse: MapFilters = {
    dateFilter: initialFilters?.dateFilter || currentFilters.dateFilter,
    riskLevel: initialFilters?.riskLevel || currentFilters.riskLevel
  };

  // Verificar si necesitamos hacer fetch basado en caché y filtros
  const shouldFetch = useSelector((state: RootState) => 
    selectShouldFetchData(state, filtersToUse)
  );

  useEffect(() => {
    if (isAuthenticated && user && shouldFetch) {
      dispatch(setFilters(filtersToUse));
      dispatch(fetchMapData(filtersToUse));
    }
  }, [isAuthenticated, user, shouldFetch, dispatch]);

  const refetch = async (newFilters?: Partial<MapFilters>) => {
    if (!isAuthenticated || !user) return;

    const updatedFilters = { ...currentFilters, ...newFilters };
    dispatch(setFilters(updatedFilters));
    await dispatch(fetchMapData(updatedFilters));
  };

  return {
    points: data.points,
    zoneStats: data.zoneStats,
    filters: data.filters,
    metadata: data.metadata,
    isLoading,
    error,
    refetch
  };
}

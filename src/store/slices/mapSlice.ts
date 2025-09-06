import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface MapPoint {
  id: string;
  centerLat: number;
  centerLng: number;
  address: string;
  totalCases: number;
  dominantRisk: 'low' | 'medium' | 'high';
  riskLevels: {
    low: number;
    medium: number;
    high: number;
  };
  averageTemp: number;
  lastUpdate: string;
}

interface ZoneStat {
  name: string;
  cases: number;
  risk: string;
  color: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  details: {
    riskBreakdown: {
      low: number;
      medium: number;
      high: number;
    };
    averageTemperature: number;
    lastUpdate: string;
  };
}

interface MapFilters {
  dateFilter: 'lastWeek' | 'lastMonth' | '3months' | '1year' | 'all';
  riskLevel: 'all' | 'low' | 'medium' | 'high';
}

interface MapData {
  points: MapPoint[];
  zoneStats: ZoneStat[];
  filters: MapFilters & {
    dateRange: {
      from: string;
      to: string;
    };
  };
  metadata: {
    totalPoints: number;
    clusters: number;
    riskDistribution: Record<string, number>;
  };
}

interface MapState {
  data: MapData;
  currentFilters: MapFilters;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null; // Timestamp de la última llamada
  cacheTimeout: number; // 5 minutos en ms
}

const initialState: MapState = {
  data: {
    points: [],
    zoneStats: [],
    filters: {
      dateFilter: 'lastWeek',
      riskLevel: 'all',
      dateRange: {
        from: '',
        to: ''
      }
    },
    metadata: {
      totalPoints: 0,
      clusters: 0,
      riskDistribution: {}
    }
  },
  currentFilters: {
    dateFilter: 'lastWeek',
    riskLevel: 'all'
  },
  isLoading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000 // 5 minutos
};

// Async thunk para fetch de datos
export const fetchMapData = createAsyncThunk(
  'map/fetchData',
  async (filters: MapFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        dateFilter: filters.dateFilter,
        riskLevel: filters.riskLevel
      });

      const response = await fetch(`/api/map-data?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos del mapa');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error desconocido');
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.currentFilters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = mapSlice.actions;
export default mapSlice.reducer;

// Selectores
export const selectMapData = (state: { map: MapState }) => state.map.data;
export const selectMapFilters = (state: { map: MapState }) => state.map.currentFilters;
export const selectMapLoading = (state: { map: MapState }) => state.map.isLoading;
export const selectMapError = (state: { map: MapState }) => state.map.error;

// Selector para determinar si los datos están en caché y son válidos
export const selectShouldFetchData = (state: { map: MapState }, newFilters: MapFilters) => {
  const { lastFetch, cacheTimeout, currentFilters } = state.map;
  
  // Si no hay datos previos, fetch
  if (!lastFetch) return true;
  
  // Si los filtros cambiaron, fetch
  const filtersChanged = 
    currentFilters.dateFilter !== newFilters.dateFilter ||
    currentFilters.riskLevel !== newFilters.riskLevel;
  
  if (filtersChanged) return true;
  
  // Si el cache expiró, fetch
  const now = Date.now();
  if (now - lastFetch > cacheTimeout) return true;
  
  return false;
};

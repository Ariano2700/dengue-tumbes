import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  profileCompleted: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  profileFetched: boolean; // Para evitar múltiples fetches
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  profileFetched: false
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // El API devuelve { user: userData }
      return data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }
);

export const completeUserProfile = createAsyncThunk(
  'auth/completeUserProfile',
  async (profileData: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error completing profile:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to complete profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBasicUser: (state, action: PayloadAction<{
      id: string;
      email: string;
      name?: string;
      picture?: string;
    }>) => {
      // Solo crear un usuario básico si no existe ya uno
      if (!state.user) {
        state.user = {
          ...action.payload,
          profileCompleted: false // Solo para usuarios nuevos
        };
      }
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.profileFetched = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        // Crear o actualizar el usuario completo con los datos de la BD
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          name: action.payload.name,
          picture: action.payload.picture,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          dni: action.payload.dni,
          phone: action.payload.phone,
          profileCompleted: action.payload.profileCompleted || false
        };
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.profileFetched = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // completeUserProfile
      .addCase(completeUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload,
            profileCompleted: true
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setBasicUser, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectProfileFetched = (state: RootState) => state.auth.profileFetched;

export default authSlice.reducer;
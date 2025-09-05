import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name?: string | null
  picture?: string | null
  firstName?: string | null
  lastName?: string | null
  dni?: string | null
  phone?: string | null
  profileCompleted: boolean
  createdAt?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false
    },
  },
})

export const {
  setLoading,
  setUser,
  updateUserProfile,
  setError,
  clearError,
  logout,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import mapReducer from './slices/mapSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import progressReducer, { SCHEMA_VERSION } from '@/features/progress/progressSlice'

const rootReducer = combineReducers({
  progress: progressReducer,
})

/**
 * Migration registry. Keys are the target schema version; each function
 * receives the previously-persisted state and returns the new shape.
 *
 * Add a migration here (and bump SCHEMA_VERSION in the progress slice)
 * whenever a breaking change is made to persisted state.
 */
const migrations = {}

const persistConfig = {
  key: 'mathsprint-root',
  version: SCHEMA_VERSION,
  storage,
  whitelist: ['progress'],
  migrate: createMigrate(migrations, { debug: false }),
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

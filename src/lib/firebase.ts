import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain || 'cabai-fdceb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId || 'cabai-fdceb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket || 'cabai-fdceb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Connect to Cloud Firestore database with reliable Long-Polling & Local Caching
// to guarantee rock-solid connectivity in sandboxed iframes & web environments
let dbInstance;
try {
  const customDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || config.firestoreDatabaseId;
  const firestoreSettings = {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  };

  if (customDatabaseId && customDatabaseId !== '(default)') {
    dbInstance = initializeFirestore(app, firestoreSettings, customDatabaseId);
  } else {
    dbInstance = initializeFirestore(app, firestoreSettings);
  }
} catch (err) {
  // If Firestore is already initialized or IndexedDB cache is restricted in sandbox, fallback gracefully
  try {
    const customDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || config.firestoreDatabaseId;
    if (customDatabaseId && customDatabaseId !== '(default)') {
      dbInstance = getFirestore(app, customDatabaseId);
    } else {
      dbInstance = getFirestore(app);
    }
  } catch (fallbackErr) {
    console.warn('[Firebase] Fallback getFirestore initialized:', fallbackErr);
    dbInstance = getFirestore(app);
  }
}

export const db = dbInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

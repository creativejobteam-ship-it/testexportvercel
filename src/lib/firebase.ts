
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Helper to safely access environment variables or provide fallback for demo/dev
const getEnvVar = (key: string, fallback?: string) => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        return import.meta.env[key];
    }
    return fallback;
};

// Hardcoded fallback configuration provided by user
// This ensures the app works immediately without .env files in the web container
const fallbackConfig = {
  apiKey: "AIzaSyB6N5NMT-a3XlVurZIA2mAxHqlfLeTLLKU",
  authDomain: "auto-cm-app.firebaseapp.com",
  projectId: "auto-cm-app",
  storageBucket: "auto-cm-app.firebasestorage.app",
  messagingSenderId: "129338351644",
  appId: "1:129338351644:web:5749a93ef638dad6a47fd9",
  measurementId: "G-XZTCNY12FQ"
};

// Update config with safe access, prioritizing env vars but falling back to hardcoded values
const safeConfig = {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY', fallbackConfig.apiKey),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', fallbackConfig.authDomain),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', fallbackConfig.projectId),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', fallbackConfig.storageBucket),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', fallbackConfig.messagingSenderId),
    appId: getEnvVar('VITE_FIREBASE_APP_ID', fallbackConfig.appId),
    measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', fallbackConfig.measurementId)
};

let app;
let auth;
let db;
let storage;
let googleProvider;

try {
  // Only initialize if we have a valid config (basic check)
  if (safeConfig.apiKey) {
      app = initializeApp(safeConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      googleProvider = new GoogleAuthProvider();
  } else {
      console.warn("Firebase configuration missing. App running in offline/demo mode.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db, storage, googleProvider };
export default app;

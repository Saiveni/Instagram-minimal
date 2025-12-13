import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDOVYSQaU9hZgpCf9lwOgZWN5F71JMRbFo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "instagram-d65a3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "instagram-d65a3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "instagram-d65a3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "36583212260",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:36583212260:web:9a686d2f5777f6da0f18f1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

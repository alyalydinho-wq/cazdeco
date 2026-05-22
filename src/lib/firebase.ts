/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Remplissez ces informations après avoir créé votre projet sur console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "VOTRE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "VOTRE_PROJET.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "VOTRE_PROJET",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "VOTRE_PROJET.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "APP_ID"
};

// Toggle manually to false if using the app without Firebase
export const isFirebaseConfigured = firebaseConfig.apiKey !== '' && firebaseConfig.apiKey !== 'VOTRE_API_KEY' && firebaseConfig.apiKey !== undefined;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';

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
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.apiKey !== 'VOTRE_API_KEY' && 
  firebaseConfig.apiKey !== undefined;

console.log('--- DEBUG FIREBASE INITIALIZATION ---');
console.log('Firebase Configured Status:', isFirebaseConfigured);
console.log('Project ID:', firebaseConfig.projectId);
console.log('API Key configured (boolean):', !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'VOTRE_API_KEY');
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('------------------------------------');

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Normalise un document Firestore vers l'interface Product de l'application
 * avec des valeurs par défaut robustes pour éviter tout crash d'affichage.
 */
export function mapFirestoreDocToProduct(docId: string, docData: any): Product {
  const stockVal = typeof docData.stock !== 'undefined' ? Number(docData.stock) : 10;
  return {
    id: docId || docData.id || "",
    name: docData.name || "Produit sans nom",
    description: docData.description || "",
    categoryId: String(docData.categoryId || ""),
    price: Number(docData.price) || 0,
    oldPrice: docData.oldPrice ? Number(docData.oldPrice) : undefined,
    stock: stockVal,
    status: docData.status || (stockVal === 0 ? 'outofstock' : 'active'),
    badge: docData.badge || undefined,
    badges: Array.isArray(docData.badges) ? docData.badges : (docData.badge ? [docData.badge] : []),
    isBestSeller: !!docData.isBestSeller,
    images: Array.isArray(docData.images) && docData.images.length > 0 
      ? docData.images 
      : [docData.image || '/placeholder.jpg'],
    sku: docData.sku || `SKU-${Math.floor(Math.random() * 1000000)}`,
    subcategory: docData.subcategory || undefined,
    createdAt: typeof docData.createdAt === 'number' ? docData.createdAt : Date.now(),
    tileLength: docData.tileLength ? Number(docData.tileLength) : undefined,
    tileWidth: docData.tileWidth ? Number(docData.tileWidth) : undefined,
    tilesPerBox: docData.tilesPerBox ? Number(docData.tilesPerBox) : undefined,
    sqmPerBox: docData.sqmPerBox ? Number(docData.sqmPerBox) : undefined,
  };
}

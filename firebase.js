import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "apikiey",
  authDomain: "inventory-management-app.firebaseapp.com",
  projectId: "inventory-management-app",
  storageBucket: "inventory-management-app.appspot.com",
  messagingSenderId: "239551305282",
  appId: "1:239551305282:web:8593c66ee4e2694920ffdb",
  measurementId: "G-7M5JYK7ZWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Initialize Firestore

export { firestore }; // Export Firestore instance

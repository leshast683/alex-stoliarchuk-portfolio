import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD84A0lMn2KTS75EGeO4z-yxj0rWWQZ5_I",
  authDomain: "contact-717a6.firebaseapp.com",
  projectId: "contact-717a6",
  storageBucket: "contact-717a6.firebasestorage.app",
  messagingSenderId: "640878400769",
  appId: "1:640878400769:web:a361a7716bbd6c6c57f700",
  measurementId: "G-K4117M3J2H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

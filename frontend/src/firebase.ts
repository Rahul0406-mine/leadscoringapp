
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// Replace with your project's credentials
const firebaseConfig = {
  apiKey: "AIzaSyBop2f2GAoYYtV-KzLASmk9vTJfOiBELDs",
  authDomain: "leadscoringapp-6be19.firebaseapp.com",
  projectId: "leadscoringapp-6be19",
  storageBucket: "leadscoringapp-6be19.firebasestorage.app",
  messagingSenderId: "9928659812",
  appId: "1:9928659812:web:96283e7003df3362eb6071",
  measurementId: "G-FVNP6LGMZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

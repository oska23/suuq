// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqeokkd4nIm9h22rslrztjQLRN-5I3nMQ",
  authDomain: "suuqa-1.firebaseapp.com",
  projectId: "suuqa-1",
  storageBucket: "suuqa-1.appspot.com",
  messagingSenderId: "542000340784",
  appId: "1:542000340784:web:6137b7212bf94b37e732f5",
  measurementId: "G-2GPKWNWH3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
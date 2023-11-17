// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
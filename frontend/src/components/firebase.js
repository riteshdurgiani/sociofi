// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS8QrWpEZ7NVVDD5i0fW9fqF-pGR7RdhE",
  authDomain: "sociofi-a5300.firebaseapp.com",
  projectId: "sociofi-a5300",
  storageBucket: "sociofi-a5300.appspot.com",
  messagingSenderId: "481219694635",
  appId: "1:481219694635:web:ab07ae520054f403785a6e",
  measurementId: "G-KRFF5FYPXM"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(initializeApp(firebaseConfig))
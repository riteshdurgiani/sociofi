import { initializeApp } from "firebase/app";
import "firebase/firestore";

const fbConfig = {
    apiKey: "AIzaSyBS8QrWpEZ7NVVDD5i0fW9fqF-pGR7RdhE",
    authDomain: "sociofi-a5300.firebaseapp.com",
    projectId: "sociofi-a5300",
    storageBucket: "sociofi-a5300.appspot.com",
    messagingSenderId: "481219694635",
    appId: "1:481219694635:web:ab07ae520054f403785a6e",
    measurementId: "G-KRFF5FYPXM"
};

const app = initializeApp(fbConfig)

export default app;
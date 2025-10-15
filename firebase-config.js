// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-fNlQQHC4Fqbx2wIBoyPOm8o43PUhJrk",
    authDomain: "ai-roadmap-nadeem.firebaseapp.com",
    projectId: "ai-roadmap-nadeem",
    storageBucket: "ai-roadmap-nadeem.appspot.com",
    messagingSenderId: "882087451108",
    appId: "1:882087451108:web:65fbb714732407d1768ff1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

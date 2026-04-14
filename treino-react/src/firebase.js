// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8omt3u3xND6KsQ7hUHGMKZ4ri1GfsJ0Q",
    authDomain: "meu-controle-financeiro-b9644.firebaseapp.com",
    projectId: "meu-controle-financeiro-b9644",
    storageBucket: "meu-controle-financeiro-b9644.firebasestorage.app",
    messagingSenderId: "336900681191",
    appId: "1:336900681191:web:a13d7d19c944a5d8aca142"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
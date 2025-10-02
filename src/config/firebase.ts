import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAt40OcFSQcKL5-_KPFgzamnNsjFy54ZYk",
  authDomain: "deckygo-3bc1f.firebaseapp.com",
  projectId: "deckygo-3bc1f",
  storageBucket: "deckygo-3bc1f.appspot.com",
  messagingSenderId: "877880160497",
  appId: "1:877880160497:web:730bbf1fea6bec8885b950",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usarás en tu app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

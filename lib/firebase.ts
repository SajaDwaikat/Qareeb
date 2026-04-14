import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-OFwRKKGcSL6_eVzA4F7ZDG2OLuoH09w",
  authDomain: "qareeb-2025.firebaseapp.com",
  projectId: "qareeb-2025",
  storageBucket: "qareeb-2025.firebasestorage.app",
  messagingSenderId: "869966851022",
  appId: "1:869966851022:web:3f9a056d602dea6c80d99f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
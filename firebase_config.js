// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCtGuCxGkKS_yP5pF3WnIkp10bs7zY-Cu8",
  authDomain: "optshop-bdc0d.firebaseapp.com",
  projectId: "optshop-bdc0d",
  storageBucket: "optshop-bdc0d.appspot.com",
  messagingSenderId: "1061985781183",
  appId: "1:1061985781183:web:b2f110878d2f4c58ba8d0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Senin firebase config'in
const firebaseConfig = {
  apiKey: "AIzaSyB_jpy9VVPHXQTUwpO6eRzRqP33ZQJVvtI",
  authDomain: "recipeapp-7bfa6.firebaseapp.com",
  projectId: "recipeapp-7bfa6",
  storageBucket: "recipeapp-7bfa6.firebasestorage.app",
  messagingSenderId: "864809071634",
  appId: "1:864809071634:web:dacd8de81ce3c546c994cb"
};

// Firebase'i baslat
const app = initializeApp(firebaseConfig);

// Firestore erisimini al
const db = getFirestore(app);

export { db };

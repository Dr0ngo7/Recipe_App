// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_jpy9VVPHXQTUwpO6eRzRqP33ZQJVvtI",
  authDomain: "recipeapp-7bfa6.firebaseapp.com",
  projectId: "recipeapp-7bfa6",
  storageBucket: "recipeapp-7bfa6.appspot.com",
  messagingSenderId: "864809071634",
  appId: "1:864809071634:web:dacd8de81ce3c546c994cb"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_jpy9VVPHXQTUwpO6eRzRqP33ZQJVvtI",
  authDomain: "recipeapp-7bfa6.firebaseapp.com",
  projectId: "recipeapp-7bfa6",
  storageBucket: "recipeapp-7bfa6.appspot.com",
  messagingSenderId: "864809071634",
  appId: "1:864809071634:web:dacd8de81ce3c546c994cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const yemis = [
  
   "yumurta", "un", "şeker", "domates", "patates",
    "süt", "yoğurt", "tereyağ", "soğan", "sarımsak",
    "pul biber", "ayçiçek yağı", "kabartma tozu",
    "zeytinyağı", "pirinç", "beyaz peynir", "ekmek",
    "limon", "kakao", "makarna", "bulgur",
    "kuru soğan", "domates salçası", "kuru nane",
    "bal", "kekik", "vanilya", "kaşar", "maydanoz",
    "siyah zeytin", "kimyon", "margarin",
    "yeşil biber", "salatalık", "kırmızı mercimek",
    "nane", "salça", "tarçın", "pilavlık pirinç",
    "bitkisel yağ","tuz"
];

async function upload() {
  try {
    await setDoc(doc(db, 'ingredients', 'Temel'), {
      items: yemis,
      label: "Temel"
    });
    
    
    console.log("Başarıyla yüklendi.");
  } catch (e) {
    console.error("Hata oluştu:", e);
  }
}

upload();

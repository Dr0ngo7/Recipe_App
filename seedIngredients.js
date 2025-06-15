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
  
   "dana ciğer", "kuzu ciğer", "tavuk ciğeri", "işkembe", "kokoreç", "kuzu paça", "mumbar", "tavuk taşlık",
    "dana dil", "kuzu böbrek", "kuzu kelle", "bağırsak", "dana böbrek", "kuzu işkembe", "dana kelle",
    "koç yumurtası", "kuzu gömleği", "kuzu yürek", "uykuluk", "ördek ciğeri"
];

async function upload() {
  try {
    await setDoc(doc(db, 'ingredients', 'Sakatatlar'), {
      items: yemis,
      label: "Sakatatlar"
    });
    
    
    console.log("Başarıyla yüklendi.");
  } catch (e) {
    console.error("Hata oluştu:", e);
  }
}

upload();

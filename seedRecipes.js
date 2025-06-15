import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';

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

const recipe = {
  title: "Patatesli Yumurta",
  description: "Kahvaltıya doyurucu ve lezzetli bir başlangıç: Kızarmış patatesin üzerine yumurta!",
  instructions: [
    "2 Adet Orta Boy Patates",
    "2 Adet Yumurta",
    "2 Yemek Kaşığı Sıvı Yağ",
    "1 Çay Kaşığı Tuz",
    "1. Patatesleri küp küp doğrayın.",
    "2. Tavaya yağ ekleyip patatesleri kızartın.",
    "3. Patatesler yumuşayınca üzerine yumurtaları kırın.",
    "4. Tuz serpin ve pişene kadar ocakta tutun.",
    "Afiyet olsun!"
  ],
  time: 20,
  calories: 350,
  category: "Kahvaltı",
  ingredients: ["patates", "yumurta", "sıvı yağ", "tuz"],
  difficulty: "Kolay",
  isFavorite: false,
  status: true,
  createdAt: serverTimestamp()
};

async function uploadRecipe() {
  try {
    const docRef = await addDoc(collection(db, 'pendingRecipes'), recipe);
    console.log("Tarif başarıyla eklendi. ID:", docRef.id);
  } catch (error) {
    console.error("Tarif eklenirken hata oluştu:", error);
  }
}

uploadRecipe();

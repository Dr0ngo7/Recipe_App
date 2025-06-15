// favorites.js
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from './firebase';

// Tek tarif için favori durumunu değiştir
export const toggleFavorite = async (userId, recipeId) => {
  if (!userId) return;

  const favRef = doc(db, 'users', userId, 'favorites', recipeId);
  const snapshot = await getDoc(favRef);

  if (snapshot.exists()) {
    await deleteDoc(favRef);
    console.log('Favoriden çıkarıldı');
  } else {
    await setDoc(favRef, { addedAt: Date.now() });
    console.log('Favorilere eklendi');
  }
};

// Kullanıcının tüm favori tariflerini al
export const getUserFavorites = async (userId) => {
  if (!userId) return [];

  const favsCol = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favsCol);
  return snapshot.docs.map(doc => doc.id); // sadece ID'leri döndür
};

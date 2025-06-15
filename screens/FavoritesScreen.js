import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getUserFavorites } from '../favorites';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const favIds = await getUserFavorites(user.uid);
      const favRecipes = [];

      for (const id of favIds) {
        const docRef = doc(db, 'pendingRecipes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().status === true) {
          favRecipes.push({ id: docSnap.id, ...docSnap.data() });
        }
      }

      setFavorites(favRecipes);
    } catch (error) {
      console.error('Favoriler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Hiç favori tarif yok.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.category} | {item.time} dk</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888'
  },
  card: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    marginTop: 4,
    color: '#666'
  }
});

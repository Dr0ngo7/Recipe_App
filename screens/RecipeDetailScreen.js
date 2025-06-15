import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { toggleFavorite, getUserFavorites } from '../favorites';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (user) {
        const favorites = await getUserFavorites(user.uid);
        setIsFav(favorites.includes(recipe.id));
      }
    };

    checkFavorite();
  }, []);

  const handleToggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await toggleFavorite(user.uid, recipe.id);

    // Durumu tersine çevir
    setIsFav((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>📷 Görsel yok</Text>
      )}

      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
        <Text style={styles.favButtonText}>
          {isFav ? '❤️ Favoriden Çıkar' : '🤍 Favorilere Ekle'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>🕒 Süre: {recipe.time} dk</Text>
        <Text style={styles.infoText}>🔥 Kalori: {recipe.calories} kcal</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📂 Kategori: {recipe.category}</Text>
        <Text style={styles.infoText}>📊 Zorluk: {recipe.difficulty}</Text>
      </View>

      <Text style={styles.subheading}>🧂 Malzemeler:</Text>
      <View style={styles.tagContainer}>
        {recipe.ingredients?.map((item, idx) => (
          <Text key={idx} style={styles.tag}>{item}</Text>
        ))}
      </View>

      <Text style={styles.subheading}>📝 Tarif:</Text>
      <Text style={styles.instructions}>{recipe.instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12
  },
  noImage: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 12
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6
  },
  description: {
    fontSize: 16,
    marginBottom: 12
  },
  favButton: {
    backgroundColor: '#ffeaea',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  favButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#555'
  },
  subheading: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 6
  },
  instructions: {
    marginTop: 8,
    fontSize: 15,
    color: '#333'
  }
});

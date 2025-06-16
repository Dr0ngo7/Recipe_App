import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { auth } from '../firebase';
import { toggleFavorite, getUserFavorites } from '../favorites';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
    setIsFav((prev) => !prev);
  };

  return (
    <LinearGradient colors={['#f5f6fa', '#e0dcd5']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.image} />
        ) : (
          <View style={styles.noImageBox}>
            <Text style={styles.noImage}>📷 Görsel yok</Text>
          </View>
        )}

        <View style={styles.headerRow}>
          <Text style={styles.title}>{recipe.title}</Text>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <AntDesign
              name={isFav ? 'heart' : 'hearto'}
              size={28}
              color={isFav ? '#e74c3c' : '#444'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoItem}>🕒 {recipe.time} dk</Text>
          <Text style={styles.infoItem}>🔥 {recipe.calories} kcal</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoItem}>📂 {recipe.category}</Text>
          <Text style={styles.infoItem}>📊 {recipe.difficulty}</Text>
        </View>

        <Text style={styles.subheading}>🧂 Malzemeler</Text>
        <View style={styles.tagContainer}>
          {recipe.ingredients?.map((item, idx) => (
            <Text key={idx} style={styles.tag}>{item}</Text>
          ))}
        </View>

 <Text style={styles.subheading}>📝 Tarif:</Text>

<View style={styles.instructionsBox}>
  {Array.isArray(recipe.instructions) ? (
    recipe.instructions.map((step, index) => (
      <Text key={index} style={styles.instructionStep}>
      {step}
      </Text>
    ))
  ) : (
    <Text style={styles.instructions}>{recipe.instructions}</Text>
  )}
</View>
      </ScrollView>
    </LinearGradient>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16
  },
  noImageBox: {
    height: 220,
    backgroundColor: '#dfe6e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  noImage: {
    fontStyle: 'italic',
    color: '#888'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    color: '#2d3436'
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  infoItem: {
    fontSize: 14,
    color: '#636e72'
  },
  subheading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  tag: {
    backgroundColor: '#dcd3c8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    color: '#2d3436'
  },
 instructionsBox: {
  backgroundColor: '#fefefe',
  borderRadius: 12,
  padding: 16,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2
},
  instructions: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22
  },
  instructionStep: {
  marginBottom: 6,
  fontSize: 15,
  color: '#2d3436',
  lineHeight: 22
}
});

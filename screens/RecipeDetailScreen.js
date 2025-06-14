import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>📷 Görsel yok</Text>
      )}

      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

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
          <Text key={idx} style={styles.tag}>
            {item}
          </Text>
        ))}
      </View>

      {/* 👇 Tarifin Yapılış Adımları */}
      <Text style={styles.subheading}>📖 Tarifin Yapılış Adımları:</Text>
      <Text style={styles.stepsText}>
        {recipe.instructions?.trim() || 'Adımlar belirtilmemiş.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40
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
  stepsText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#444'
  }
});

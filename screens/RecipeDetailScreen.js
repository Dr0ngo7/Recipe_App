import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.desc}>{recipe.description}</Text>
      <Text style={styles.extra}>Süre: {recipe.time} dk</Text>
      <Text style={styles.extra}>Kalori: {recipe.calories} kcal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, marginBottom: 20 },
  extra: { fontSize: 14, color: '#666' }
});

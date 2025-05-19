import React, { useState } from 'react';
import { useLayoutEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import recipes from '../data/recipes.json';

export default function RecipeScreen({ route, navigation }) {
  const newRecipe = route?.params?.newRecipe;

const allRecipes = newRecipe ? [newRecipe, ...recipes] : recipes;

  const ingredients = route?.params?.ingredients || '';
  const ingredientList = ingredients
    .toLowerCase()
    .split(/[\s,]+/)
    .map(i => i.trim())
    .filter(Boolean);

  const [selectedCategory, setSelectedCategory] = useState('Hepsi');

  const categories = ['Hepsi', 'Kahvaltı', 'Ana Yemek', 'Tatlı'];
//HomeScreen.js'deki malzeme seçimi
  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesIngredients =
      ingredientList.length === 0 ||
      ingredientList.some(ing =>
        recipe.description.toLowerCase().includes(ing)
      );
  //HomeScreen.js'deki kategori seçimi
    const matchesCategory =
      selectedCategory === 'Hepsi' || recipe.category === selectedCategory;
  
    return matchesIngredients && matchesCategory;
  });
  
//Tarif Ekleme Butonu
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddRecipe')} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 16, color: '#007AFF' }}>➕ Ekle</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      {/*Kategori filtreleme*/}
      <Text style={styles.label}>Kategori Seç:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
      </Picker>
      {/*Tarifleri listeleme*/}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  picker: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0'
  },
  item: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

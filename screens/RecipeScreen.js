import React, { useState, useEffect } from 'react';
import { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// 🔁 context'ten seçilen malzemeler ve eşleşme modu alınır
import { useSelectedIngredients } from '../context/SelectedIngredientsContext';

export default function RecipeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');

  // 🌍 context'ten seçilen malzemeler ve eşleşme modu alınır
  const { selectedIngredients, matchMode } = useSelectedIngredients();

  const categories = ['Hepsi', 'Kahvaltı', 'Ana Yemek', 'Tatlı'];

  useEffect(() => {
    const fetchApprovedRecipes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pendingRecipes'));
        const approved = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(recipe => recipe.status === true);
        setRecipes(approved);
      } catch (error) {
        console.error('Tarifler alınamadı:', error);
      }
    };

    fetchApprovedRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients?.map(i => i.toLowerCase()) || [];

    const matchesIngredients =
      selectedIngredients.length === 0 ||
      (matchMode === 'AND'
        ? selectedIngredients.every(ing => recipeIngredients.includes(ing.toLowerCase()))
        : selectedIngredients.some(ing => recipeIngredients.includes(ing.toLowerCase()))
      );

    const matchesCategory =
      selectedCategory === 'Hepsi' || recipe.category === selectedCategory;

    return matchesIngredients && matchesCategory;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRecipe')}
          style={{ marginRight: 10 }}
        >
          <Text style={{ fontSize: 16, color: '#007AFF' }}>➕ Ekle</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
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

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
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

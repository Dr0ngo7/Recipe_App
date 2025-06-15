import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import { useSelectedIngredients } from '../context/SelectedIngredientsContext';

export default function RecipeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Hepsi');

  const [sortField, setSortField] = useState(null); // 'calories', 'time', 'ingredients'
  const [sortOrder, setSortOrder] = useState('none'); // 'asc', 'desc', 'none'

  const { selectedIngredients, matchMode } = useSelectedIngredients();

  const categories = ['Hepsi', 'Kahvaltı', 'Ana Yemek', 'Tatlı'];
  const difficulties = ['Hepsi', 'Kolay', 'Orta', 'Zor'];

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

  const handleSortToggle = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('desc');
    } else {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortOrder('none');
        setSortField(null);
      } else {
        setSortOrder('desc');
      }
    }
  };

  const getSortSymbol = (field) => {
    if (sortField !== field) return '⬍';
    if (sortOrder === 'asc') return '🔼';
    if (sortOrder === 'desc') return '🔽';
    return '⬍';
  };

  const filteredRecipes = recipes
    .filter(recipe => {
      const defaultIngredients = ['su'];

      const recipeIngredients = [...(recipe.ingredients?.map(i => i.toLowerCase()) || []),...defaultIngredients];

      const matchesIngredients =
        selectedIngredients.length === 0 ||
        (matchMode === 'AND'
          ? selectedIngredients.every(ing => recipeIngredients.includes(ing.toLowerCase()))
          : selectedIngredients.some(ing => recipeIngredients.includes(ing.toLowerCase()))
        );

      const matchesCategory =
        selectedCategory === 'Hepsi' || recipe.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'Hepsi' || recipe.difficulty === selectedDifficulty;

      return matchesIngredients && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortOrder === 'none' || !sortField) return 0;

      const fieldA = sortField === 'ingredients' ? a.ingredients.length : a[sortField];
      const fieldB = sortField === 'ingredients' ? b.ingredients.length : b[sortField];

      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
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
      <TouchableOpacity onPress={() => setFilterOpen(prev => !prev)}>
        <Text style={styles.filterToggle}>
          {filterOpen ? '🔽 Filtreyi Gizle' : '🔼 Filtre'}
        </Text>
      </TouchableOpacity>

      {filterOpen && (
        <View style={styles.advancedFilter}>
          <Text style={styles.label}>Kategori:</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>

          <Text style={styles.label}>Zorluk:</Text>
          <Picker
            selectedValue={selectedDifficulty}
            onValueChange={(value) => setSelectedDifficulty(value)}
            style={styles.picker}
          >
            {difficulties.map((diff) => (
              <Picker.Item label={diff} value={diff} key={diff} />
            ))}
          </Picker>

          <Text style={styles.label}>Sıralama:</Text>
          <View style={styles.sortRow}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => handleSortToggle('calories')}
            >
              <Text>Kalori {getSortSymbol('calories')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => handleSortToggle('time')}
            >
              <Text>Süre {getSortSymbol('time')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => handleSortToggle('ingredients')}
            >
              <Text>Malzeme {getSortSymbol('ingredients')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  },
  filterToggle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF'
  },
  advancedFilter: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6
  }
});

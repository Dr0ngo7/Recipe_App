// Updated RecipeScreen with modern header UI
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelectedIngredients } from '../context/SelectedIngredientsContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RecipeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Hepsi');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('none');

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
      if (sortOrder === 'desc') setSortOrder('asc');
      else if (sortOrder === 'asc') {
        setSortOrder('none');
        setSortField(null);
      } else setSortOrder('desc');
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
      const recipeIngredients = [...(recipe.ingredients?.map(i => i.toLowerCase()) || []), ...defaultIngredients];
      const matchesIngredients =
        selectedIngredients.length === 0 ||
        (matchMode === 'AND'
          ? selectedIngredients.every(ing => recipeIngredients.includes(ing.toLowerCase()))
          : selectedIngredients.some(ing => recipeIngredients.includes(ing.toLowerCase())));
      const matchesCategory = selectedCategory === 'Hepsi' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'Hepsi' || recipe.difficulty === selectedDifficulty;
      return matchesIngredients && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortOrder === 'none' || !sortField) return 0;
      const fieldA = sortField === 'ingredients' ? a.ingredients.length : a[sortField];
      const fieldB = sortField === 'ingredients' ? b.ingredients.length : b[sortField];
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
     <ImageBackground
  source={require('../assets/header-pattern.png')}
  style={styles.header}
  resizeMode="cover"
>
  <TouchableOpacity
  style={styles.addButton}
  onPress={() => navigation.navigate('AddRecipe')}
>
  <Ionicons name="add-circle-outline" size={44} color="#fff" />
</TouchableOpacity>


  <Text style={styles.headerText}>Tarifler</Text>

  <TextInput
    placeholder="Tarif ara..."
    style={styles.searchInput}
    placeholderTextColor="#636e72"
  />
</ImageBackground>


      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => setFilterOpen(prev => !prev)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
  
  <Text style={styles.filterToggle}>Filtreyi {filterOpen ? 'Gizle' : 'Göster'}</Text>
  <Ionicons
    name={filterOpen ? 'chevron-down' : 'chevron-up'}
    size={18}
    color="#0984e3" 
    style={{ marginLeft: 3, marginBottom: 5 }}
  />
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
              <TouchableOpacity style={styles.sortButton} onPress={() => handleSortToggle('calories')}>
                <Text>Kalori {getSortSymbol('calories')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sortButton} onPress={() => handleSortToggle('time')}>
                <Text>Süre {getSortSymbol('time')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sortButton} onPress={() => handleSortToggle('ingredients')}>
                <Text>Malzeme {getSortSymbol('ingredients')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {filteredRecipes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: width,
    padding: 24,
    paddingBottom: 32,
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: '#00000044',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 4,
    letterSpacing: 0.5
  },
  searchInput: {
    width: '90%',
    borderRadius: 12,
    backgroundColor: '#ffffffee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdde1'
  },
  contentContainer: {
    marginTop: -20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#f5f6fa',
    paddingTop: 24,
    paddingBottom: 100,
    paddingHorizontal: 20
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  picker: { marginBottom: 16, backgroundColor: '#f0f0f0' },
  filterToggle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0984e3 '
  },
  advancedFilter: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 1
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
  },
  item: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
 addButton: {
  position: 'absolute',
  top: 36,
  right: 15,
  zIndex: 10,

  backgroundColor: '#ffffff22', // Daha hafif transparanlık
  borderRadius: 50,
  padding: 2, // Eskiden 4’tü, daha ince halka

  // Hafif gölge efekti
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0.1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 50
}




});
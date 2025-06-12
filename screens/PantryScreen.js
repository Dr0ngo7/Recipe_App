import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function HomeScreen({ navigation }) {
  const [ingredientsData, setIngredientsData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [matchMode, setMatchMode] = useState('AND'); // veya 'OR'

  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, 'ingredients'));
      const data = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data().items;
      });
      setIngredientsData(data);
      setFilteredData(data); // ilk durumda tümünü göster
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredData(ingredientsData);
    } else {
      const filtered = {};
      Object.entries(ingredientsData).forEach(([category, items]) => {
        const matched = items.filter(item =>
          item.toLowerCase().includes(searchText.toLowerCase())
        );
        if (matched.length > 0) {
          filtered[category] = matched;
        }
      });
      setFilteredData(filtered);
    }
  }, [searchText, ingredientsData]);

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleListRecipes = () => {
    navigation.navigate('Recipes', {
      ingredients: selectedIngredients,
      matchMode: matchMode
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Malzeme ara..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      {/* VE / VEYA mantığı seçimi */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[styles.modeButton, matchMode === 'AND' && styles.modeButtonActive]}
          onPress={() => setMatchMode('AND')}
        >
          <Text style={matchMode === 'AND' ? styles.modeButtonTextActive : styles.modeButtonText}>Tümü (VE)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, matchMode === 'OR' && styles.modeButtonActive]}
          onPress={() => setMatchMode('OR')}
        >
          <Text style={matchMode === 'OR' ? styles.modeButtonTextActive : styles.modeButtonText}>Biri (VEYA)</Text>
        </TouchableOpacity>
      </View>

      {Object.entries(filteredData).map(([category, items]) => (
        <View key={category} style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.tagContainer}>
            {items.map((item, idx) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleIngredient(item)}
                  style={[
                    styles.tag,
                    isSelected && styles.tagSelected
                  ]}
                >
                  <Text style={isSelected ? styles.tagTextSelected : styles.tagText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Tarifleri Listele butonu */}
      <Button
        title={`Tarifleri Listele (${selectedIngredients.length})`}
        onPress={handleListRecipes}
        disabled={selectedIngredients.length === 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  categoryBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6
  },
  tagSelected: {
    backgroundColor: '#c1e1c1'
  },
  tagText: {
    color: '#333'
  },
  tagTextSelected: {
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  modeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#eee',
    borderRadius: 6
  },
  modeButtonActive: {
    backgroundColor: '#4CAF50'
  },
  modeButtonText: {
    textAlign: 'center',
    color: '#000'
  },
  modeButtonTextActive: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  }
});

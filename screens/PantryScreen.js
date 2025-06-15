import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelectedIngredients } from '../context/SelectedIngredientsContext';

export default function PantryScreen({ navigation }) {
  const [ingredientsData, setIngredientsData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const {
    selectedIngredients,
    setSelectedIngredients,
    matchMode,
    setMatchMode
  } = useSelectedIngredients();

  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, 'ingredients'));
      const data = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data().items;
      });
      setIngredientsData(data);
      setFilteredData(data);
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
      applyFilter: true
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Malzeme ara..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />

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

        {Object.entries(filteredData).map(([category, items]) => {
          const isExpanded = expandedCategories[category];
          const visibleItems = isExpanded ? items : items.slice(0, 15);
          const remainingCount = items.length - 15;

          return (
            <View key={category} style={styles.categoryBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedCategories(prev => ({
                      ...prev,
                      [category]: !prev[category]
                    }))
                  }
                >
                  <Text style={{ fontSize: 18 }}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tagContainer}>
                {visibleItems.map((item, idx) => {
                  const isSelected = selectedIngredients.includes(item);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => toggleIngredient(item)}
                      style={[styles.tag, isSelected && styles.tagSelected]}
                    >
                      <Text style={isSelected ? styles.tagTextSelected : styles.tagText}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}

                {!isExpanded && remainingCount > 0 && (
                  <TouchableOpacity
                    style={[styles.tag, { backgroundColor: '#ddd' }]}
                    onPress={() =>
                      setExpandedCategories(prev => ({
                        ...prev,
                        [category]: true
                      }))
                    }
                  >
                    <Text style={{ fontWeight: 'bold' }}>+{remainingCount} Daha</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.fixedButton}>
        <Button
          title={`Tarifleri Listele (${selectedIngredients.length})`}
          onPress={handleListRecipes}
          disabled={selectedIngredients.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    padding: 16,
    paddingBottom: 80
  },
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
  },
  fixedButton: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16
  }
});

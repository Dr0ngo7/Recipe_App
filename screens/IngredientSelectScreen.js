import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function IngredientSelectScreen({ navigation, route }) {
  const [selected, setSelected] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState({});

  // Toggle seçimi
  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  // Geri AddRecipe'e veri gönder
  const handleDone = () => {
    if (route.params?.onSelectIngredients) {
      route.params.onSelectIngredients(selected);
    }
    navigation.goBack();
  };

  // Seçili malzemeleri geri yükle
  useEffect(() => {
    if (route.params?.selectedIngredients) {
      setSelected(route.params.selectedIngredients);
    }
  }, []);

  // Firestore'dan malzemeleri al
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'ingredients'));
        const data = {};
        snapshot.forEach(doc => {
          data[doc.id] = doc.data().items;
        });
        setIngredientCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Malzemeler alınamadı:', error);
      }
    };

    fetchIngredients();
  }, []);

  // Arama filtresi
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCategories(ingredientCategories);
    } else {
      const filtered = {};
      Object.entries(ingredientCategories).forEach(([category, items]) => {
        const matched = items.filter(item =>
          item.toLowerCase().includes(searchText.toLowerCase())
        );
        if (matched.length > 0) {
          filtered[category] = matched;
        }
      });
      setFilteredCategories(filtered);
    }
  }, [searchText, ingredientCategories]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Malzeme ara..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(filteredCategories).length > 0 &&
          Object.entries(filteredCategories).map(([category, items]) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleSelect(item)}
                  style={[
                    styles.item,
                    selected.includes(item) && styles.selectedItem
                  ]}
                >
                  <Text style={selected.includes(item) ? styles.selectedText : styles.itemText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </ScrollView>

      {/* Sabit buton */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          onPress={handleDone}
          style={styles.fixedButton}
        >
          <Text style={styles.buttonText}>
            Seçilen ({selected.length}) Malzemeyle Devam Et
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
    backgroundColor: '#fff'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  item: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  selectedItem: {
    backgroundColor: '#cde',
    borderColor: '#46f',
  },
  itemText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold'
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  fixedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

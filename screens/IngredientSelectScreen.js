import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function IngredientSelectScreen({ navigation, route }) {
  const [selected, setSelected] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState({});

  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleDone = () => {
    if (route.params?.onSelectIngredients) {
      route.params.onSelectIngredients(selected);
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params?.selectedIngredients) {
      setSelected(route.params.selectedIngredients);
    }
  }, []);

 useEffect(() => {
  const fetchIngredients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'ingredients'));
      const data = {};
      snapshot.forEach(doc => {
        const { label, items } = doc.data();
        if (label && items) {
          data[label] = items; // ← label'ı başlık olarak kullan
        }
      });
      setIngredientCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Malzemeler alınamadı:', error);
    }
  };

  fetchIngredients();
}, []);

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
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Malzeme ara..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#636e72"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.entries(filteredCategories).map(([category, items]) => (
          <View key={category} style={styles.categoryBox}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.tagContainer}>
              {items.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleSelect(item)}
                  style={[
                    styles.tag,
                    selected.includes(item) && styles.tagSelected
                  ]}
                >
                  <Text style={selected.includes(item) ? styles.tagTextSelected : styles.tagText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.ButtonContainer}>
  <TouchableOpacity onPress={handleDone} style={styles.submitButton}>
    <Text style={styles.buttonText}>
      Seçilen ({selected.length}) Malzemeyle Devam Et
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 20,
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdde1'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 10
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#dfe6e9',
    marginBottom: 6,
    marginRight: 6
  },
  tagSelected: {
    backgroundColor: '#74b9ff'
  },
  tagText: {
    color: '#2d3436'
  },
  tagTextSelected: {
    color: '#2d3436',
    fontWeight: 'bold'
  },

ButtonContainer: {
  position: 'absolute',
  bottom: 45, // <- Yukarı alındı
  width: '100%',
  alignItems: 'center', // Ortaladı
  zIndex: 10 // Önde kalması için
},
submitButton: {
  backgroundColor: '#0984e3',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  width: '90%', // Genişliği biraz içeride tut
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 3
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold'
}

});

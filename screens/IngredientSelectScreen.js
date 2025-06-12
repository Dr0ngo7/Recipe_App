import React, { useState } from 'react';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';



export default function IngredientSelectScreen({ navigation, route }) {
  const [selected, setSelected] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState({});

  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

   const handleDone = () => {
    if (route.params?.onSelectIngredients) {
      route.params.onSelectIngredients(selected); // AddRecipe'e gönder
    }
    navigation.goBack(); // Yeni sayfa açmadan sadece geri dön
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
          data[doc.id] = doc.data().items;
        });
        setIngredientCategories(data);
      } catch (error) {
        console.error('Malzemeler alınamadı:', error);
      }
    };

    fetchIngredients();
  }, []);

  




   return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(ingredientCategories).length > 0 &&
        Object.entries(ingredientCategories).map(([category, items]) => (
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

      <Button title={`Seçilen (${selected.length}) Malzemeyle Devam Et`} onPress={handleDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
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
  }
});

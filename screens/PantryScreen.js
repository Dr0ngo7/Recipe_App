import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  Dimensions
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelectedIngredients } from '../context/SelectedIngredientsContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <ImageBackground
          source={require('../assets/header-pattern.png')}
          style={styles.header}
          resizeMode="cover"
        >
          <Text style={styles.headerText}>Kiler</Text>
          <TextInput
            placeholder="Malzeme ara..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#636e72"
            style={styles.searchInput}
          />
        </ImageBackground>

        {/* Linear Gradient içeriği */}
        <LinearGradient
          colors={['#f5f6fa', '#dcd3c8']}
          style={styles.contentContainer}
        >
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
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedCategories(prev => ({
                        ...prev,
                        [category]: !prev[category]
                      }))
                    }
                  >
                    <Text style={styles.expandToggle}>{isExpanded ? '▲' : '▼'}</Text>
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
                      style={[styles.tag, styles.tagMore]}
                      onPress={() =>
                        setExpandedCategories(prev => ({
                          ...prev,
                          [category]: true
                        }))
                      }
                    >
                      <Text style={styles.moreText}>+{remainingCount} Daha</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          <View style={{ height: 100 }} />
        </LinearGradient>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.listButtonFixed,
          selectedIngredients.length === 0 && styles.listButtonDisabled
        ]}
        onPress={handleListRecipes}
        disabled={selectedIngredients.length === 0}
      >
        <Text style={styles.listButtonText}>Tarifleri Listele ({selectedIngredients.length})</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f6fa' },
  container: { paddingBottom: 160 },
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
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: '#00000044',
    textShadowOffset: { width: 2, height: 5 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  searchInput: {
    width: '90%',
    borderRadius: 12,
    backgroundColor: '#ffffffee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdde1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  contentContainer: {
    marginTop: -20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    //backgroundColor: '#f5f6fa',
    paddingTop: 24,
    paddingHorizontal: 20
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#dfe6e9'
  },
  modeButtonActive: {
    backgroundColor: '#0984e3'
  },
  modeButtonText: {
    textAlign: 'center',
    color: '#2d3436'
  },
  modeButtonTextActive: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  categoryBox: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436'
  },
  expandToggle: {
    fontSize: 18,
    color: '#636e72'
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
  tagMore: {
    backgroundColor: '#b2bec3'
  },
  moreText: {
    fontWeight: 'bold',
    color: '#2d3436'
  },
  listButtonFixed: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0984e3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 10
  },
  listButtonDisabled: {
    backgroundColor: '#b2bec3'
  },
  listButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

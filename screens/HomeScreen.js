import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [ingredients, setIngredients] = useState('');

  const handleSearch = () => {
    navigation.navigate('Recipes', { ingredients });
  };

  return (
    //Arama Barı
    <View style={styles.container}>
      <Text style={styles.label}>Malzeme gir:</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="örn: yumurta, domates"
      />

      <Button title="Tarifleri Göster" onPress={handleSearch} />

      {/* Tüm Tarifler Butonu */}
      <View style={{ marginTop: 10 }}>
        <Button
          title="📄 Tüm Tarifleri Göster"
          onPress={() => navigation.navigate('Recipes', { ingredients: '' })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16
  }
});

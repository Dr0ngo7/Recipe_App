import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AddRecipeScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('Kahvaltı');

  const handleAddRecipe = () => {
    if (!title || !description || !time) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const newRecipe = {
      id: Date.now(), // geçici ID
      title,
      description,
      time: parseInt(time),
      calories: parseInt(calories),
      category
    };

    // 🔁 Geri dönüşte bu veriyi RecipeScreen'e göndereceğiz
    navigation.navigate('Recipes', { newRecipe });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlık:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Açıklama:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Süre (dk):</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="numeric" />

      <Text style={styles.label}>Kalori:</Text>
      <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" />

      <Text style={styles.label}>Kategori:</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        <Picker.Item label="Kahvaltı" value="Kahvaltı" />
        <Picker.Item label="Ana Yemek" value="Ana Yemek" />
        <Picker.Item label="Tatlı" value="Tatlı" />
      </Picker>

      <Button title="Tarifi Ekle" onPress={handleAddRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  }
});

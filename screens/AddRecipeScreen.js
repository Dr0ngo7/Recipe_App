import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, TouchableOpacity, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ScrollView } from 'react-native';

export default function AddRecipeScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [time, setTime] = useState('');
  const [difficulty, setDifficulty] = useState('Kolay');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('Kahvaltı');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("İzin Gerekli", "Resim seçebilmek için galeri erişimi gerekli.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddRecipe = async () => {
    if (!title || !description || !time || !calories) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      await addDoc(collection(db, 'pendingRecipes'), {
        title,
        description,
        time: parseInt(time),
        calories: parseInt(calories),
        category,
        ingredients: ingredients.split(',').map(item => item.trim()),
        image: image || '',
        difficulty,
        isFavorite: false,
        status: 'waiting',
        createdAt: serverTimestamp()
      });

      Alert.alert('Gönderildi', 'Tarifiniz onaya gönderildi.');
      navigation.goBack();
    } catch (error) {
      console.error('Firestore hata:', error);
      Alert.alert('Hata', 'Tarif gönderilirken bir hata oluştu.');
    }
  };

  return (
     <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
        ) : (
          <Text style={styles.label}>📷 Resim seçmek için dokun</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Başlık:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Açıklama:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Malzemeler (virgülle):</Text>
      <TextInput style={styles.input} value={ingredients} onChangeText={setIngredients} />

      <Text style={styles.label}>Süre (dk):</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="numeric" />

      <Text style={styles.label}>Zorluk:</Text>
      <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={styles.input}>
        <Picker.Item label="Kolay" value="Kolay" />
        <Picker.Item label="Orta" value="Orta" />
        <Picker.Item label="Zor" value="Zor" />
      </Picker>

      <Text style={styles.label}>Kalori:</Text>
      <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" />

      <Text style={styles.label}>Kategori:</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        <Picker.Item label="Kahvaltı" value="Kahvaltı" />
        <Picker.Item label="Ana Yemek" value="Ana Yemek" />
        <Picker.Item label="Tatlı" value="Tatlı" />
      </Picker>

      <Button title="Tarifi Ekle" onPress={handleAddRecipe} />
     </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  }
});

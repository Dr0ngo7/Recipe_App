import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';

export default function AddRecipeScreen({ navigation }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [time, setTime] = useState('');
  const [difficulty, setDifficulty] = useState('Kolay');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('Kahvaltı');

  const handleIngredientsUpdate = (newIngredients) => {
    setSelectedIngredients(newIngredients);
    setIngredients(newIngredients.join(', '));
  };

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

  const handleRemoveIngredient = (itemToRemove) => {
    const updated = selectedIngredients.filter(item => item !== itemToRemove);
    setSelectedIngredients(updated);
    setIngredients(updated.join(', '));
  };

  const handleAddRecipe = async () => {
    if (!title || !description || !time || !calories || !instructions) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImageAsync(image);
      }

      await addDoc(collection(db, 'pendingRecipes'), {
        title,
        description,
        instructions,
        time: parseInt(time),
        calories: parseInt(calories),
        category,
        ingredients: selectedIngredients,
        image: imageUrl,
        difficulty,
        isFavorite: false,
        status: false,
        createdAt: serverTimestamp()
      });

      Alert.alert('Gönderildi', 'Tarifiniz onaya gönderildi.', [
        {
          text: 'Tamam',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main', state: { routes: [{ name: 'Recipes' }], index: 0 } }]
            });
          }
        }
      ]);
    } catch (error) {
      console.error('Firestore hata:', error);
      Alert.alert('Hata', 'Tarif gönderilirken bir hata oluştu.');
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `recipes/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("uploadImageAsync hata:", error);
      throw error;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.topSpacer} /> 
  <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
    {image ? (
      <Image source={{ uri: image }} style={styles.image} />
    ) : (
      <Text style={styles.imagePlaceholder}>📷 Görsel seç</Text>
    )}
  </TouchableOpacity>

      <Text style={styles.label}>Başlık</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput style={[styles.input, { height: 60 }]} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Tarif Adımları</Text>
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        placeholder="1. Fırını 180 dereceye ayarlayın..."
      />

      <View style={styles.inlineContainer}>
  <Text style={styles.label}>Malzemeler:</Text>

  <TouchableOpacity
    style={styles.ingredientButton}
    onPress={() =>
      navigation.navigate('IngredientSelect', {
        selectedIngredients,
        onSelectIngredients: handleIngredientsUpdate
      })
    }
  >
    <Text style={styles.ingredientButtonText}>Seç ({selectedIngredients.length})</Text>
  </TouchableOpacity>
</View>


      {selectedIngredients.length > 0 && (
        <View style={styles.tagContainer}>
          {selectedIngredients.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => handleRemoveIngredient(item)} style={styles.tag}>
              <Text style={styles.tagText}>{item} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Süre (dk)</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="numeric" />

      <Text style={styles.label}>Zorluk</Text>
      <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={styles.picker}>
        <Picker.Item label="Kolay" value="Kolay" />
        <Picker.Item label="Orta" value="Orta" />
        <Picker.Item label="Zor" value="Zor" />
      </Picker>

      <Text style={styles.label}>Kalori</Text>
      <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" />

      <Text style={styles.label}>Kategori</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
        <Picker.Item label="Kahvaltı" value="Kahvaltı" />
        <Picker.Item label="Ana Yemek" value="Ana Yemek" />
        <Picker.Item label="Tatlı" value="Tatlı" />
      </Picker>

      <TouchableOpacity onPress={handleAddRecipe} style={styles.submitButton}>
        <Text style={styles.submitText}>Tarifi Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#f5f6fa'
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#2d3436'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16
  },
 imagePicker: {
  marginBottom: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f1f2f6'
},
 imagePlaceholder: {
  color: '#888',
  fontSize: 16
},

  image: {
  width: '100%',
  height: 200,
  borderRadius: 8
},
  picker: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6
  },
  tag: {
    backgroundColor: '#dfe6e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 14,
    color: '#2d3436'
  },
  submitButton: {
  marginTop: 24,
  backgroundColor: '#6c5ce7', 
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3
},
submitText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600'
},
inlineContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 10,
  paddingRight: 6 // sağa çok yapışmasın
},
ingredientButton: {
  backgroundColor: '#6c5ce7',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  marginTop:12,
},
ingredientButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14
},
topSpacer: {
  height: 20 // veya 30 deneyebilirsin, notch durumuna göre
},

});

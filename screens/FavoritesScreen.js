import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { getUserFavorites } from '../favorites';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const favIds = await getUserFavorites(user.uid);
      const favRecipes = [];

      for (const id of favIds) {
        const docRef = doc(db, 'pendingRecipes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().status === true) {
          favRecipes.push({ id: docSnap.id, ...docSnap.data() });
        }
      }

      setFavorites(favRecipes);
    } catch (error) {
      console.error('Favoriler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../assets/header-pattern.png')}
        style={styles.header}
        resizeMode="cover"
      >
        <Text style={styles.headerText}>Favoriler</Text>
      </ImageBackground>

      <View style={styles.contentContainer}>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>Hiç favori tarif yok.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>
                  {item.category} | {item.time} dk
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    width: width,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
  fontSize: 36,
  fontWeight: '700',
  color: '#ffffff',
  textShadowColor: '#00000044',
  textShadowOffset: { width: 2, height: 5 },
  textShadowRadius: 4,
  letterSpacing: 0.5,
  textAlign: 'center',
  paddingTop: 50,     // Yazının iç boşluğu üstten
  marginTop: -50,
  marginBottom: 50     // Yazının konumunu yukarı iter
}
,
  contentContainer: {
    marginTop: -20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#f5f6fa',
    paddingTop: 24,
    paddingHorizontal: 20,
    flex: 1
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#636e72'
  },
  card: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    marginTop: 4,
    color: '#636e72'
  },
  container: {
  flex: 1,
  padding: 16
}
});

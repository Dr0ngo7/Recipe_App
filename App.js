import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { SelectedIngredientsProvider } from './context/SelectedIngredientsContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // Giriş durumu belirlenmeden hiçbir şey gösterme

return (
    <SelectedIngredientsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SelectedIngredientsProvider>
  );
}

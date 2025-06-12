
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PantryScreen from '../screens/PantryScreen'
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import IngredientSelectScreen from '../screens/IngredientSelectScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={PantryScreen} />
      <Stack.Screen name="Recipes" component={RecipeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
      <Stack.Screen name="IngredientSelect" component={IngredientSelectScreen} />
    </Stack.Navigator>
  );
}

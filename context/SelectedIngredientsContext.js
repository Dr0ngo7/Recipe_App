
import React, { createContext, useState, useContext } from 'react';

const SelectedIngredientsContext = createContext();

export const SelectedIngredientsProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [matchMode, setMatchMode] = useState('OR'); // veya 'AND'

  return (
    <SelectedIngredientsContext.Provider value={{ selectedIngredients, setSelectedIngredients, matchMode, setMatchMode }}>
      {children}
    </SelectedIngredientsContext.Provider>
  );
};

export const useSelectedIngredients = () => useContext(SelectedIngredientsContext);

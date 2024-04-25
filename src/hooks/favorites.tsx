import { ReactNode, createContext, useContext, useState } from 'react';

interface FavoritesContextType {
  favorites: Record<string, string[]>;
  addToFavorite: (group: string, value: string) => void;
  removeFromFavorite: (group: string, value: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: {},
  addToFavorite: () => {},
  removeFromFavorite: () => {},
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Record<string, string[]>>(() => {
    const state = JSON.parse(localStorage.getItem('favorites') || '{}');

    return state;
  });

  const addToFavorite = (group: string, value: string) => {
    const temp = { ...favorites, [group]: [...(favorites[group] || []), value] };

    localStorage.setItem('favorites', JSON.stringify(temp));
    setFavorites(temp);
  };

  const removeFromFavorite = (group: string, value: string) => {
    const temp = { ...favorites, [group]: (favorites[group] || []).filter((fav) => fav !== value) };

    localStorage.setItem('favorites', JSON.stringify(temp));
    setFavorites(temp);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorite, removeFromFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const favorites = useContext(FavoritesContext);

  return favorites;
};

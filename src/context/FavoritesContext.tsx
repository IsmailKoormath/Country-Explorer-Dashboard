import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";


/* =======================
   Types
======================= */

export interface Country {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[]; 
  region: string;
  subregion?: string;
  population: number;
  languages?: Record<string, string>;
  currencies?: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  timezones?: string[];
  [key: string]: unknown; 
}

interface FavoritesContextType {
  favorites: Country[];
  addFavorite: (country: Country) => void;
  removeFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
  toggleFavorite: (country: Country) => void;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

/*  Context  */

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/*  Provider  */

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Country[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? (JSON.parse(saved) as Country[]) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (country: Country) => {
    setFavorites((prev) => [...prev, country]);
  };

  const removeFavorite = (code: string) => {
    setFavorites((prev) => prev.filter((c) => c.cca3 !== code));
  };

  const isFavorite = (code: string): boolean => {
    return favorites.some((c) => c.cca3 === code);
  };

  const toggleFavorite = (country: Country) => {
    if (isFavorite(country.cca3)) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

/*   Hook  */

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
};

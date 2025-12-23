import React from "react";
import { useFavorites, type Country } from "../context/FavoritesContext";
import CountryCard from "../components/CountryCard";

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="container">
      <div className="page-header">
        <h2>Your Favorite Countries</h2>
        <p>
          {favorites.length} {favorites.length === 1 ? "country" : "countries"}{" "}
          saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <h3>No favorites yet</h3>
          <p>Start exploring and add countries to your favorites!</p>
        </div>
      ) : (
        <div className="country-grid">
          {favorites.map((country: Country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

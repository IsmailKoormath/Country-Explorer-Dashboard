import React, { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites, type Country } from "../context/FavoritesContext";

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatPopulation = (pop: number): string => {
    if (pop >= 1_000_000) {
      return `${(pop / 1_000_000).toFixed(1)}M`;
    }
    return pop.toLocaleString();
  };

  const handleCardClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleFavorite(country);
  };

  return (
    <div className="country-card" onClick={handleCardClick}>
      <button
        className={`favorite-btn ${isFavorite(country.cca3) ? "active" : ""}`}
        onClick={handleFavoriteClick}
      >
        {isFavorite(country.cca3) ? "❤️" : "🤍"}
      </button>

      <img
        src={country.flags?.png}
        alt={`${country.name?.common || "Country"} flag`}
        className="country-flag"
      />

      <div className="country-info">
        <h3 className="country-name">{country.name?.common}</h3>

        <div className="country-details">
          <p>
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
          <p>
            <strong>Region:</strong> {country.region}
          </p>
          <p>
            <strong>Population:</strong> {formatPopulation(country.population)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCountryByCode,
  getWeatherByCity,
  type WeatherData,
} from "../services/api";
import { useFavorites, type Country } from "../context/FavoritesContext";

const CountryDetails: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [country, setCountry] = useState<Country | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) fetchCountryDetails(code);
  }, [code]);

  useEffect(() => {
    if (country?.capital?.[0]) {
      fetchWeather(country.capital[0]);
    }
  }, [country]);

  const fetchCountryDetails = async (code: string) => {
    try {
      setLoading(true);
      const data = await getCountryByCode(code);
      setCountry(data);
      setError(null);
    } catch {
      setError("Failed to load country details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city: string) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch {
      setWeatherError("Weather data unavailable");
    } finally {
      setWeatherLoading(false);
    }
  };

  const formatPopulation = (pop: number): string => pop.toLocaleString();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || "Country not found"}</p>
          <button onClick={() => navigate("/")} className="btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-back">
        ← Back
      </button>

      <div className="country-details-page">
        <div className="details-header">
          <img
            src={country.flags?.svg}
            alt={`${country.name?.common || "Country"} flag`}
            className="details-flag"
          />

          <div className="details-title">
            <h1>{country.name?.common}</h1>
            <p className="official-name">{country.name?.official}</p>
            <button
              className={`favorite-btn-large ${
                isFavorite(country.cca3) ? "active" : ""
              }`}
              onClick={() => toggleFavorite(country)}
            >
              {isFavorite(country.cca3)
                ? "❤️ Remove from Favorites"
                : "🤍 Add to Favorites"}
            </button>
          </div>
        </div>

        <div className="details-grid">
          <div className="details-section">
            <h3>General Information</h3>
            <div className="details-content">
              <div className="detail-item">
                <strong>Capital:</strong>
                <span>{country.capital?.[0] || "N/A"}</span>
              </div>
              <div className="detail-item">
                <strong>Region:</strong>
                <span>{country.region}</span>
              </div>
              <div className="detail-item">
                <strong>Sub-region:</strong>
                <span>{country.subregion || "N/A"}</span>
              </div>
              <div className="detail-item">
                <strong>Population:</strong>
                <span>{formatPopulation(country.population)}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Languages & Currencies</h3>
            <div className="details-content">
              <div className="detail-item">
                <strong>Languages:</strong>
                <span>
                  {country.languages
                    ? Object.values(country.languages).join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <strong>Currencies:</strong>
                <span>
                  {country.currencies
                    ? Object.values(country.currencies)
                        .map((c: any) => `${c.name} (${c.symbol})`)
                        .join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <strong>Time Zones:</strong>
                <span>{country.timezones?.join(", ") || "N/A"}</span>
              </div>
            </div>
          </div>

          {country.capital?.[0] && (
            <div className="details-section weather-section">
              <h3>Weather in {country.capital[0]}</h3>
              <div className="details-content">
                {weatherLoading && (
                  <div className="weather-loading">
                    <div className="spinner-small"></div>
                    <p>Loading weather...</p>
                  </div>
                )}

                {weatherError && (
                  <div className="weather-error">
                    <p>{weatherError}</p>
                  </div>
                )}

                {weather && !weatherLoading && (
                  <div className="weather-info">
                    <div className="weather-main">
                      <div className="weather-icon">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                          alt={weather.weather[0].description}
                        />
                      </div>
                      <div className="weather-temp">
                        <span className="temp">
                          {Math.round(weather.main.temp)}°C
                        </span>
                        <span className="condition">
                          {weather.weather[0].description}
                        </span>
                      </div>
                    </div>

                    <div className="weather-details">
                      <div className="weather-item">
                        <strong>Humidity:</strong>
                        <span>{weather.main.humidity}%</span>
                      </div>
                      <div className="weather-item">
                        <strong>Wind Speed:</strong>
                        <span>{weather.wind.speed} m/s</span>
                      </div>
                      <div className="weather-item">
                        <strong>Feels Like:</strong>
                        <span>{Math.round(weather.main.feels_like)}°C</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;

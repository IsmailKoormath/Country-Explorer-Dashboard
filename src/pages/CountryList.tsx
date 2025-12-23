import React, { useState, useEffect, useMemo } from "react";
import { getAllCountries } from "../services/api";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import type { Country } from "../context/FavoritesContext";

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedPopulation, setSelectedPopulation] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState<number>(10);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getAllCountries();
      setCountries(data);
      setError(null);
    } catch (err) {
      setError("Failed to load countries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name?.common.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((country) =>
        selectedRegion === "All" ? true : country.region === selectedRegion
      )
      .filter((country) => {
        const pop = country.population;
        switch (selectedPopulation) {
          case "small":
            return pop < 10_000_000;
          case "medium":
            return pop >= 10_000_000 && pop <= 50_000_000;
          case "large":
            return pop > 50_000_000;
          default:
            return true;
        }
      });
  }, [countries, searchQuery, selectedRegion, selectedPopulation]);

  const displayedCountries = filteredCountries.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchCountries} className="btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header compact">
        <h2>Explore Countries</h2>
        <p>
          Discover information about {countries.length} countries around the
          world
        </p>
      </div>
<div className="search-filter-container">
      <SearchBar onSearch={setSearchQuery} />

      <Filters
        selectedRegion={selectedRegion}
        selectedPopulation={selectedPopulation}
        onRegionChange={setSelectedRegion}
        onPopulationChange={setSelectedPopulation}
      />
</div>
      <div className="results-info compact">
        <p>
          Showing {displayedCountries.length} of {filteredCountries.length}{" "}
          countries
        </p>
      </div>

      <div className="country-grid">
        {displayedCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>

      {displayedCountries.length === 0 && (
        <div className="no-results">
          <p>No countries found matching your criteria.</p>
        </div>
      )}

      {displayedCountries.length < filteredCountries.length && (
        <div className="load-more">
          <button onClick={handleLoadMore} className="btn btn-primary">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryList;

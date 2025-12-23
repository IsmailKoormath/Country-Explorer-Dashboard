// src/App.tsx
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaHome, FaHeart } from "react-icons/fa";
import CountryList from "./pages/CountryList";
import CountryDetails from "./pages/CountryDetails";
import Favorites from "./pages/Favorites";
import { useFavorites } from "./context/FavoritesContext";

const App: React.FC = () => {
  const location = useLocation();
  const { favorites } = useFavorites();

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">🌍 Country Explorer</h1>

            <nav className="nav">
              <Link
                to="/"
                className={
                  location.pathname === "/" ? "nav-link active" : "nav-link"
                }
              >
                <span className="nav-text">Home</span>
                <FaHome className="nav-icon" size={20} />
              </Link>

              <Link
                to="/favorites"
                className={
                  location.pathname === "/favorites"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span className="nav-text">Favorites ({favorites.length})</span>
                <FaHeart className="nav-icon" size={20} />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route path="/country/:code" element={<CountryDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

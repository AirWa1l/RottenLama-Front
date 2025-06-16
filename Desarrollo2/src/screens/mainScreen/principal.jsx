import React, { useState } from "react";
import logo from "/logo.png";
import CarruselInfinito from "../../components/Carrusel/carruselInfinito.jsx";
import Carrusel from "../../components/Carrusel/carrusel.jsx";
import useAuth from "../../API/auth";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton/logoutButton.jsx";
import Searchbar from "../../components/SearchBar/searchbar.jsx";
import "./principal.css";

const Principal = () => {
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user } = useAuth();

  // Lista mock de películas
  const peliculas = [
    { id: 1, titulo: "Inception" },
    { id: 2, titulo: "The Matrix" },
    { id: 3, titulo: "Pulp Fiction" },
    { id: 4, titulo: "Interstellar" },
    { id: 5, titulo: "Fight Club" }
  ];

  // Filtrado por búsqueda
  const peliculasFiltradas = peliculas.filter((peli) =>
    peli.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Carrusel infinito
  const images = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg"
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-text">
            Spitting <span className="brand-subtext">Llama</span>
          </span>
        </div>

        <div className="header">
          {/* Reemplazamos el input directo por el componente */}
          <Searchbar onSearch={setBusqueda} />

          <div className="menu-container">
            <button
              className="menu-button"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              ☰
            </button>
            {menuAbierto && (
              <div className="dropdown-menu">
                <Link to="/categories">Categories</Link>
                <Link to="/my-reviews">My Reviews</Link>
                <Link to="/premieres">Premieres</Link>
                <Link to="/coming-soon">Coming Soon</Link>
              </div>
            )}
          </div>

          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </div>

      {/* Carrusel Infinito (banner superior) */}
      <div className="carrusel-banner">
        <CarruselInfinito images={images} />
      </div>

      {/* Carrusel Estático con Flechas */}
      <div className="static-carousel-container">
        <Carrusel />
      </div>

      {/* Resultados de la búsqueda */}
      <div className="resultados-busqueda">
        {busqueda && (
          <>
            <h2>Resultados de "{busqueda}"</h2>
            {peliculasFiltradas.length > 0 ? (
              <ul>
                {peliculasFiltradas.map((peli) => (
                  <li key={peli.id}>{peli.titulo}</li>
                ))}
              </ul>
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Principal;

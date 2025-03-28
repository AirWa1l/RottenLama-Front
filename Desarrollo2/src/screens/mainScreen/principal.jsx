import React, { useState } from "react";
import logo from "/logo.png";
import CarruselInfinito from "../Carrusel/CarruselInfinito.jsx";
import Carrusel from "../Carrusel/carrusel.jsx";
import "./principal.css";
import { Link } from "react-router-dom";

const Principal = () => {
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Array de imágenes para el carrusel infinito
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
                    <span className="brand-text">Spitting <span className="brand-subtext">Llama</span></span>
                </div>

                <div className="header">
                    <input
                        type="text"
                        placeholder="Search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="search-bar"
                    />

                    <div className="menu-container">
                        <button className="menu-button" onClick={() => setMenuAbierto(!menuAbierto)}>
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
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
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
        </div>
    );
};

export default Principal;
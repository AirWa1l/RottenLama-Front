import React, { useEffect, useRef } from "react";
import "./carruselInfinito.css";

const CarruselInfinito = ({ images }) => {
    const carruselRef = useRef(null);

    useEffect(() => {
        const carrusel = carruselRef.current;
        if (carrusel) {
            carrusel.style.animation = "scroll 10s linear infinite";
        }
    }, []);

    return (
        <div className="carrusel-container">
            <div className="carrusel" ref={carruselRef}>
                {[...images, ...images].map((img, index) => (
                    <img key={index} src={img} alt={`Imagen ${index}`} className="carrusel-img" />
                ))}
            </div>
        </div>
    );
};

export default CarruselInfinito;

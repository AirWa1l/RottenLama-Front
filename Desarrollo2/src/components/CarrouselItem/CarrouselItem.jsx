// 3. CarouselItem.jsx -Component for each item in the carousel
import React from "react";
import "../../screens/carrouselScreen/carrouselScreen.css";

const CarrouselItem = ({ movie, onMovieSelect }) => {
  return (
    <div 
      className="carousel-item"
      data-testid="movie-item"
      onClick={() => onMovieSelect(movie.backgroundImage, movie.id)}
    >
      <img src={movie.thumbnailImage} alt={movie.alt} />
    </div>
  );
};

export default CarrouselItem;
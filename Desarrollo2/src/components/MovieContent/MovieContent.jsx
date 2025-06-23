// 2. MovieContent.jsx - Component for the content of each film
import React from "react";
import "../../screens/carrouselScreen/carrouselScreen.css";
const MovieContent = ({ movie, isActive, onReviewClick, onAddToList }) => {
  return (
    <div 
      className={`content ${movie.id} ${isActive ? "active" : ""}`}
      data-testid={`movie-content-${movie.id}`}
    >
      <img 
        src={movie.titleImage} 
        alt={movie.title} 
        className="movie-title" 
        data-testid="title-image"
      />
      <h4 data-testid="movie-title">
        <span>{movie.year}</span>
        <span><i>{movie.rating}</i></span>
        <span>{movie.duration}</span>
        <span>{movie.genre}</span>
      </h4>
      <p data-testid="movie-description">
        {movie.description}
      </p>
      <div className="button">
        <a onClick={() => onReviewClick(movie.id)} href="#">
          <i className="fa fa-play" aria-hidden="true"></i>Reviews
        </a>
        <a onClick={() => onAddToList(movie.id)} href="#">
          <i className="fa fa-plus" aria-hidden="true"></i>My List
        </a>
      </div>
    </div>
  );
};

export default MovieContent;

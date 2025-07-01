import "./movieResult.css";

const MovieResult = ({movie}) => {
    return(
        <li className="movie-result" role="listitem">
            <div className="movie-poster">
                <img src={movie.thumbnailImage} alt={movie.alt} />
            </div>
            <div className="movie-result-content">
                <h2 className="movie-result-title">{movie.title}</h2>
                <p className="movie-result-info">{movie.year}</p>
                <div className="movie-result-rating">
                    <span className="result-stars">★★★★★</span>
                </div>
            </div>
        </li>
    
    );
};

export default MovieResult;
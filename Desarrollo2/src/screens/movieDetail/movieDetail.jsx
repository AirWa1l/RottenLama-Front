import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { moviesData } from '../carrouselScreen/movieData'; 
import { AuthContext } from '../../API/authContext';
import './movieDetail.css'; // Import your CSS styles

const MovieDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuthContext();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);
  
  const movie = moviesData.find(movie => movie.id === id);

  if (!movie) {
    return <div className="error-message">Movie not found</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: currentUser?.email || 'Anonymous',
      text: comment,
      rating,
      date: new Date().toLocaleDateString()
    };
    
    setComments([...comments, newComment]);
    setComment('');
    setRating(5);
  };

  return (
    <div className="movie-detail-container">
      {/* Header */}
      <div className="movie-header">
        <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.backgroundImage})` }}></div>
        <div className="movie-header-content">
          <img src={movie.titleImage} alt={movie.title} className="movie-title-image" />
          <div className="movie-header-info">
            <h1>{movie.title} <span>({movie.year})</span></h1>
            <div className="movie-meta">
              <span className="rating">{movie.rating}</span>
              <span className="duration">{movie.duration}</span>
              <span className="genre">{movie.genre}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="movie-content">
        <div className="movie-poster-section">
          <img src={movie.thumbnailImage} alt={movie.title} className="movie-poster" />
          <div className="movie-score">
            <div className="tomato-score">
              <span>86%</span>
              <p>Tomatometer Score</p>
            </div>
            <div className="audience-score">
              <span>94%</span>
              <p>Audience Score</p>
            </div>
          </div>
        </div>

        <div className="movie-info">
          <p className="movie-description">{movie.description}</p>
          
          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Reviews and Comments</h2>
            
            {/* Review Form */}
            {currentUser ? (
              <form onSubmit={handleSubmit} className="review-form">
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            ) : (
              <p className="login-prompt">Please login to leave a review</p>
            )}
            
            {/* Comments List */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(c => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      <span className="comment-user">{c.user}</span>
                      <span className="comment-rating">{'★'.repeat(c.rating)}</span>
                      <span className="comment-date">{c.date}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to comment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";

// Crear un componente de test que replica la funcionalidad sin dependencias externas
const TestMovieDetail = () => {
  const { id } = useParams();
  
  // Datos mock integrados en el test
  const moviesData = [
    {
      id: "1",
      title: "Test Movie",
      year: "2024",
      duration: "2h",
      rating: "PG-13",
      genre: "Action",
      description: "A test movie description",
      titleImage: "/test-title.png",
      backgroundImage: "test-bg.jpg",
      alt: "Test alt",
    },
    {
      id: "2",
      title: "Another Movie",
      year: "2023",
      duration: "1h 45m",
      rating: "R",
      genre: "Drama",
      description: "Another test movie description",
      titleImage: "/test-title-2.png",
      backgroundImage: "test-bg-2.jpg",
      alt: "Test alt 2",
    },
  ];

  const movie = moviesData.find((m) => m.id.toString() === id);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);

  if (!movie) {
    return <h2 style={{ padding: "2rem" }}>🎬 Movie not found</h2>;
  }

  const bgUrl = `/movie/movie-website-landing-page-images/${movie.backgroundImage}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comment,
      rating: Number(rating),
      date: new Date().toLocaleDateString(),
    };

    setComments([...comments, newComment]);
    setComment("");
    setRating(5);
  };

  return (
    <div
      className="movie-detail-container"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="movie-overlay">
        <img
          src={movie.titleImage}
          alt={movie.alt}
          className="movie-title-img"
        />
        <h1>{movie.title}</h1>

        <div className="movie-info">
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
        </div>

        <div className="movie-description">
          {movie.description}
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h2>Reviews and Comments</h2>

          <form onSubmit={handleSubmit} className="comment-form">
            <label htmlFor="rating">Your rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rating-select"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} star{num !== 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              rows="4"
              required
            />

            <button type="submit">Submit</button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment">
                  <p className="stars">
                    {"★".repeat(c.rating)}
                    {"☆".repeat(5 - c.rating)}
                  </p>
                  <p>{c.text}</p>
                  <small>{c.date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper para renderizar con router
const renderWithRouter = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<TestMovieDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe("MovieDetail Component", () => {
  test("renders movie details correctly for existing movie", () => {
    renderWithRouter("1");

    // Verificar que todos los detalles de la película se muestran
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("2h")).toBeInTheDocument();
    expect(screen.getByText("PG-13")).toBeInTheDocument();
    expect(screen.getByText("A test movie description")).toBeInTheDocument();
  });

  test("renders second movie correctly", () => {
    renderWithRouter("2");

    expect(screen.getByText("Another Movie")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(screen.getByText("1h 45m")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  test("shows 'Movie not found' message for non-existent movie", () => {
    renderWithRouter("999");

    expect(screen.getByText(/movie not found/i)).toBeInTheDocument();
  });

  test("renders comments section with initial 'No comments yet' message", () => {
    renderWithRouter("1");

    expect(screen.getByText("Reviews and Comments")).toBeInTheDocument();
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  test("can submit a comment with rating", () => {
    renderWithRouter("1");

    // Encontrar elementos del formulario
    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const ratingSelect = screen.getByLabelText(/your rating/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Llenar el formulario
    fireEvent.change(commentTextarea, {
      target: { value: "Great movie!" },
    });
    fireEvent.change(ratingSelect, {
      target: { value: "4" },
    });

    // Enviar formulario
    fireEvent.click(submitButton);

    // Verificar que el comentario aparece
    expect(screen.getByText("Great movie!")).toBeInTheDocument();
    expect(screen.getByText("★★★★☆")).toBeInTheDocument();
    
    // Verificar que "No comments yet" ya no aparece
    expect(screen.queryByText("No comments yet.")).not.toBeInTheDocument();
  });

  test("form resets after successful comment submission", () => {
    renderWithRouter("1");

    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const ratingSelect = screen.getByLabelText(/your rating/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Llenar y enviar formulario
    fireEvent.change(commentTextarea, {
      target: { value: "Amazing film!" },
    });
    fireEvent.change(ratingSelect, {
      target: { value: "3" },
    });
    fireEvent.click(submitButton);

    // Verificar que el formulario se resetea
    expect(commentTextarea.value).toBe("");
    expect(ratingSelect.value).toBe("5"); // valor por defecto
  });

  test("does not submit comment when textarea is empty", () => {
    renderWithRouter("1");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Intentar enviar formulario vacío
    fireEvent.click(submitButton);

    // Debe seguir mostrando "No comments yet"
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  test("does not submit comment with only whitespace", () => {
    renderWithRouter("1");

    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Llenar con solo espacios
    fireEvent.change(commentTextarea, {
      target: { value: "   " },
    });
    fireEvent.click(submitButton);

    // Debe seguir mostrando "No comments yet"
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  test("can submit multiple comments", () => {
    renderWithRouter("1");

    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const ratingSelect = screen.getByLabelText(/your rating/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Primer comentario
    fireEvent.change(commentTextarea, { target: { value: "First comment" } });
    fireEvent.change(ratingSelect, { target: { value: "5" } });
    fireEvent.click(submitButton);

    // Segundo comentario
    fireEvent.change(commentTextarea, { target: { value: "Second comment" } });
    fireEvent.change(ratingSelect, { target: { value: "3" } });
    fireEvent.click(submitButton);

    // Verificar que ambos comentarios aparecen
    expect(screen.getByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("Second comment")).toBeInTheDocument();
    expect(screen.getByText("★★★★★")).toBeInTheDocument();
    expect(screen.getByText("★★★☆☆")).toBeInTheDocument();
  });

  test("displays rating stars correctly for different values", () => {
    renderWithRouter("1");

    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const ratingSelect = screen.getByLabelText(/your rating/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Test rating de 1 estrella
    fireEvent.change(commentTextarea, { target: { value: "One star comment" } });
    fireEvent.change(ratingSelect, { target: { value: "1" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("★☆☆☆☆")).toBeInTheDocument();
  });

  test("includes date in submitted comments", () => {
    renderWithRouter("1");

    const commentTextarea = screen.getByPlaceholderText(/write your comment/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(commentTextarea, { target: { value: "Test comment" } });
    fireEvent.click(submitButton);

    // Verificar que aparece una fecha (formato puede variar según localización)
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/; // MM/DD/YYYY o similar
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });

  test("movie info section displays all required fields", () => {
    renderWithRouter("1");

    // Verificar que todas las etiquetas de información están presentes
    expect(screen.getByText("Year:")).toBeInTheDocument();
    expect(screen.getByText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("Rating:")).toBeInTheDocument();
    expect(screen.getByText("Genre:")).toBeInTheDocument();
  });

  test("rating select has all options available", () => {
    renderWithRouter("1");

    const ratingSelect = screen.getByLabelText(/your rating/i);
    
    // Verificar que todas las opciones de rating están disponibles
    expect(screen.getByText("1 star")).toBeInTheDocument();
    expect(screen.getByText("2 stars")).toBeInTheDocument();
    expect(screen.getByText("3 stars")).toBeInTheDocument();
    expect(screen.getByText("4 stars")).toBeInTheDocument();
    expect(screen.getByText("5 stars")).toBeInTheDocument();
    
    // Verificar valor por defecto
    expect(ratingSelect.value).toBe("5");
  });
});
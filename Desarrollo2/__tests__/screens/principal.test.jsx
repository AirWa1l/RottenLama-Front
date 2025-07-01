import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Principal from '../../src/screens/mainScreen/principal';

// Mock logo
jest.mock('../../src/assets/logo.png', () => '/logo.png');

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const PropTypes = require('prop-types');
  function Link({ children, to, ...rest }) {
    return (
      <a href={to} data-testid={`link-${to.replace('/', '')}`} {...rest}>
        {children}
      </a>
    );
  }
  Link.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string,
  };
  return {
    Link,
    useNavigate: () => jest.fn(),
  };
});

// Mock useAuth
const mockUser = { id: 1, username: 'testuser' };
const mockAuth = {
  user: null,
};
jest.mock('../../src/API/auth', () => ({
  __esModule: true,
  default: () => mockAuth,
}));

// Mock movieData
jest.mock('../../src/screens/carrouselScreen/movieData.js', () => ({
  moviesData: [
    { id: '1', title: 'The Matrix', year: '1999', genre: 'Sci-Fi', backgroundImage: 'matrix.jpg', titleImage: 'matrix-title.jpg', alt: 'Matrix', description: 'Neo discovers...' },
    { id: '2', title: 'Interstellar', year: '2014', genre: 'Sci-Fi', backgroundImage: 'interstellar.jpg', titleImage: 'interstellar-title.jpg', alt: 'Interstellar', description: 'Exploring space...' },
    { id: '3', title: 'Joker', year: '2019', genre: 'Drama', backgroundImage: 'joker.jpg', titleImage: 'joker-title.jpg', alt: 'Joker', description: 'Dark origin story...' },
    { id: '4', title: 'Parasite', year: '2019', genre: 'Thriller', backgroundImage: 'parasite.jpg', titleImage: 'parasite-title.jpg', alt: 'Parasite', description: 'A twisted family...' },
  ],
}));

// Mock componentes
jest.mock('../../src/components/Carrusel/carruselInfinito.jsx', () => {
  const PropTypes = require('prop-types');
  return function CarruselInfinito({ images }) {
    return <div data-testid="carrusel-infinito" data-count={images.length}></div>;
  };
});

jest.mock('../../src/components/Carrusel/carrusel.jsx', () => () => (
  <div data-testid="carrusel-estatico" />
));

jest.mock('../../src/screens/carrouselScreen/carrouselScreen.jsx', () => () => (
  <div data-testid="carrousel-screen" />
));

jest.mock('../../src/screens/resultsScreen/resultsScreen.jsx', () => {
  const PropTypes = require('prop-types');
  return function ResultsScreen({ searchResults, searchTerm }) {
    if (searchResults && searchTerm) {
      return (
        <div data-testid="results-screen-with-search">
          <h2>Results for "{searchTerm}"</h2>
          {searchResults.map((movie) => (
            <div key={movie.id} data-testid={`movie-${movie.id}`}>
              {movie.title}
            </div>
          ))}
        </div>
      );
    }
    return <div data-testid="results-screen-all" />;
  };
});

jest.mock('../../src/components/SearchBar/Searchbar.jsx', () => {
  const PropTypes = require('prop-types');
  return function Searchbar({ onSearch, suggestions }) {
    return (
      <input
        data-testid="searchbar"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        data-suggestions={suggestions?.length}
      />
    );
  };
});

jest.mock('../../src/components/LogoutButton/logoutButton.jsx', () => () => (
  <button data-testid="logout-button">Logout</button>
));

// 🧪 Tests
describe('Principal screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.user = null;
  });

  test('renders logo and navigation elements', () => {
    render(<Principal />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByTestId('link-')).toHaveAttribute('href', '/');
  });

  test('renders all main components', () => {
    render(<Principal />);
    expect(screen.getByTestId('carrousel-screen')).toBeInTheDocument();
    expect(screen.getByTestId('carrusel-infinito')).toHaveAttribute('data-count', '4');
    expect(screen.getByTestId('carrusel-estatico')).toBeInTheDocument();
    expect(screen.getByTestId('results-screen-all')).toBeInTheDocument();
  });

  test('shows Register and Login when not logged in', () => {
    render(<Principal />);
    expect(screen.getByTestId('link-register')).toBeInTheDocument();
    expect(screen.getByTestId('link-login')).toBeInTheDocument();
  });

  test('shows logout when logged in', () => {
    mockAuth.user = mockUser;
    render(<Principal />);
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  test('opens and closes menu', () => {
    render(<Principal />);
    const menuButton = screen.getByText('☰');
    fireEvent.click(menuButton);
    expect(screen.getByTestId('link-categories')).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(screen.queryByTestId('link-categories')).not.toBeInTheDocument();
  });

  test('filters movies by title', async () => {
    render(<Principal />);
    fireEvent.change(screen.getByTestId('searchbar'), {
      target: { value: 'Matrix' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('results-screen-with-search')).toBeInTheDocument();
      expect(screen.getByTestId('movie-1')).toHaveTextContent('The Matrix');
    });
  });

  test('filters movies by genre', async () => {
    render(<Principal />);
    fireEvent.change(screen.getByTestId('searchbar'), {
      target: { value: 'Drama' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('movie-3')).toBeInTheDocument();
    });
  });

  test('shows message when no match', async () => {
    render(<Principal />);
    fireEvent.change(screen.getByTestId('searchbar'), {
      target: { value: 'UnfindableMovie' },
    });

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });
});

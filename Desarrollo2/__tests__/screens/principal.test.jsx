import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Principal from '../../src/screens/mainScreen/principal';

// Mock para la imagen del logo
jest.mock('../../src/assets/logo.png', () => '/logo.png');

// Mock para react-router-dom
jest.mock('react-router-dom', () => {
  const PropTypes = require('prop-types');
  function Link({ children, to }) {
    return <a href={to} data-testid={`link-${to.replace('/', '')}`}>{children}</a>;
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

// Mock para useAuth
const mockUser = { id: 1, username: 'testuser' };
const mockAuth = {
  user: null,
};

jest.mock('../../src/API/auth', () => ({
  __esModule: true,
  default: () => mockAuth,
}));

// Mock para los datos de películas
jest.mock('../../src/screens/carrouselScreen/movieData.js', () => ({
  moviesData: [
    {
      id: "the-little-mermaid",
      title: "The Little Mermaid",
      year: "2023",
      genre: "Romance",
      thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-little-mermaid.jpeg",
      alt: "The Little Mermaid"
    },
    {
      id: "65",
      title: "65",
      year: "2023",
      genre: "Thriller",
      thumbnailImage: "/movie/movie-website-landing-page-images/movies/65.jpg",
      alt: "65"
    },
    {
      id: "the-covenant",
      title: "The Covenant",
      year: "2023",
      genre: "Action",
      thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-covenant.jpg",
      alt: "The Covenant"
    },
    {
      id: "the-black-demon",
      title: "The Black Demon",
      year: "2023",
      genre: "Horror",
      thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-black-demon.jpg",
      alt: "The Black Demon"
    }
  ]
}));

// Mock para componentes
jest.mock('../../src/components/Carrusel/carruselInfinito.jsx', () => {
  const PropTypes = require('prop-types');
  function CarruselInfinito({ images }) {
    return (
      <div data-testid="carrusel-infinito">
        <div data-testid="images-count">{images.length}</div>
      </div>
    );
  }
  CarruselInfinito.propTypes = {
    images: PropTypes.array,
  };
  return CarruselInfinito;
});

jest.mock('../../src/components/Carrusel/carrusel.jsx', () => {
  return function Carrusel() {
    return <div data-testid="carrusel-estatico" />;
  };
});

jest.mock('../../src/screens/carrouselScreen/carrouselScreen.jsx', () => {
  return function CarrouselScreen() {
    return <div data-testid="carrousel-screen" />;
  };
});

jest.mock('../../src/screens/resultsScreen/resultsScreen.jsx', () => {
  const PropTypes = require('prop-types');
  function ResultsScreen({ searchResults, searchTerm }) {
    if (searchResults && searchTerm) {
      return (
        <div data-testid="results-screen-with-search">
          <h2>Resultados de "{searchTerm}"</h2>
          {searchResults.map(movie => (
            <div key={movie.id} data-testid={`movie-${movie.id}`}>
              {movie.title}
            </div>
          ))}
        </div>
      );
    }
    return <div data-testid="results-screen-all" />;
  }
  ResultsScreen.propTypes = {
    searchResults: PropTypes.array,
    searchTerm: PropTypes.string,
  };
  return ResultsScreen;
});

jest.mock('../../src/components/LogoutButton/logoutButton.jsx', () => {
  return function LogoutButton() {
    return <button data-testid="logout-button">Logout</button>;
  };
});

jest.mock('../../src/components/SearchBar/Searchbar.jsx', () => {
  const PropTypes = require('prop-types');
  function Searchbar({ onSearch, suggestions }) {
    return (
      <input
        data-testid="searchbar"
        placeholder="Search movies..."
        onChange={(e) => onSearch(e.target.value)}
        data-suggestions={suggestions?.length || 0}
      />
    );
  }
  Searchbar.propTypes = {
    onSearch: PropTypes.func,
    suggestions: PropTypes.array,
  };
  return Searchbar;
});

describe('Principal Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.user = null;
  });

  describe('Renderizado inicial', () => {
    test('renderiza correctamente todos los elementos principales', () => {
      render(<Principal />);

      // Navbar
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Spitting')).toBeInTheDocument();
      expect(screen.getByText('Llama')).toBeInTheDocument();

      // Searchbar
      expect(screen.getByTestId('searchbar')).toBeInTheDocument();

      // Menu button
      expect(screen.getByText('☰')).toBeInTheDocument();

      // Componentes principales
      expect(screen.getByTestId('carrousel-screen')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-infinito')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-estatico')).toBeInTheDocument();
      expect(screen.getByTestId('results-screen-all')).toBeInTheDocument();
    });

    test('renderiza logo con src correcto', () => {
      render(<Principal />);
      
      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('src', '/logo.png');
      expect(logo).toHaveClass('logo');
    });

    test('pasa correctamente las imágenes al CarruselInfinito', () => {
      render(<Principal />);
      
      const imagesCount = screen.getByTestId('images-count');
      expect(imagesCount).toHaveTextContent('4'); // 4 imágenes estáticas
    });

    test('pasa sugerencias correctas al Searchbar', () => {
      render(<Principal />);
      
      const searchbar = screen.getByTestId('searchbar');
      expect(searchbar).toHaveAttribute('data-suggestions', '4'); // 4 películas
    });
  });

  describe('Autenticación y navegación', () => {
    test('muestra botones de Register y Login cuando no hay usuario', () => {
      mockAuth.user = null;
      render(<Principal />);

      expect(screen.getByTestId('link-register')).toBeInTheDocument();
      expect(screen.getByTestId('link-login')).toBeInTheDocument();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    test('muestra LogoutButton cuando hay usuario autenticado', () => {
      mockAuth.user = mockUser;
      render(<Principal />);

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
      expect(screen.queryByTestId('link-register')).not.toBeInTheDocument();
      expect(screen.queryByTestId('link-login')).not.toBeInTheDocument();
    });

    test('menu desplegable se abre y cierra correctamente', () => {
      render(<Principal />);

      const menuButton = screen.getByText('☰');
      
      // Inicialmente el menú no está visible
      expect(screen.queryByTestId('link-categories')).not.toBeInTheDocument();

      // Abrir menú
      fireEvent.click(menuButton);
      expect(screen.getByTestId('link-categories')).toBeInTheDocument();
      expect(screen.getByTestId('link-my-reviews')).toBeInTheDocument();
      expect(screen.getByTestId('link-premieres')).toBeInTheDocument();
      expect(screen.getByTestId('link-coming-soon')).toBeInTheDocument();

      // Cerrar menú
      fireEvent.click(menuButton);
      expect(screen.queryByTestId('link-categories')).not.toBeInTheDocument();
    });

    test('links del menú tienen las rutas correctas', () => {
      render(<Principal />);

      const menuButton = screen.getByText('☰');
      fireEvent.click(menuButton);

      expect(screen.getByTestId('link-categories')).toHaveAttribute('href', '/categories');
      expect(screen.getByTestId('link-my-reviews')).toHaveAttribute('href', '/my-reviews');
      expect(screen.getByTestId('link-premieres')).toHaveAttribute('href', '/premieres');
      expect(screen.getByTestId('link-coming-soon')).toHaveAttribute('href', '/coming-soon');
    });
  });

  describe('Funcionalidad de búsqueda', () => {
    test('muestra ResultsScreen sin búsqueda inicialmente', () => {
      render(<Principal />);

      expect(screen.getByTestId('results-screen-all')).toBeInTheDocument();
      expect(screen.queryByTestId('results-screen-with-search')).not.toBeInTheDocument();
    });

    test('muestra resultados cuando se realiza una búsqueda por título', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'Little' } });

      await waitFor(() => {
        expect(screen.getByTestId('results-screen-with-search')).toBeInTheDocument();
        expect(screen.getByText('Resultados de "Little"')).toBeInTheDocument();
        expect(screen.getByTestId('movie-the-little-mermaid')).toBeInTheDocument();
        expect(screen.getByText('The Little Mermaid')).toBeInTheDocument();
      });
    });

    test('filtra correctamente por género', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'Horror' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "Horror"')).toBeInTheDocument();
        expect(screen.getByTestId('movie-the-black-demon')).toBeInTheDocument();
        expect(screen.getByText('The Black Demon')).toBeInTheDocument();
      });
    });

    test('filtra correctamente por año', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: '2023' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "2023"')).toBeInTheDocument();
        expect(screen.getByTestId('movie-the-little-mermaid')).toBeInTheDocument();
        expect(screen.getByTestId('movie-65')).toBeInTheDocument();
        expect(screen.getByTestId('movie-the-covenant')).toBeInTheDocument();
        expect(screen.getByTestId('movie-the-black-demon')).toBeInTheDocument();
      });
    });

    test('búsqueda es case-insensitive', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'MERMAID' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "MERMAID"')).toBeInTheDocument();
        expect(screen.getByText('The Little Mermaid')).toBeInTheDocument();
      });
    });

    test('muestra mensaje cuando no hay resultados', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'NonExistentMovie' } });

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument();
      });
    });

    test('vuelve a mostrar todas las películas cuando se limpia la búsqueda', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      
      // Realizar búsqueda
      fireEvent.change(searchInput, { target: { value: 'Horror' } });
      await waitFor(() => {
        expect(screen.getByTestId('results-screen-with-search')).toBeInTheDocument();
      });

      // Limpiar búsqueda
      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.getByTestId('results-screen-all')).toBeInTheDocument();
        expect(screen.queryByTestId('results-screen-with-search')).not.toBeInTheDocument();
      });
    });

    test('searchbar responde a cambios continuos', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      
      // Simular escritura gradual
      fireEvent.change(searchInput, { target: { value: 'T' } });
      await waitFor(() => {
        expect(screen.getByText('The Little Mermaid')).toBeInTheDocument();
        expect(screen.getByText('The Covenant')).toBeInTheDocument();
        expect(screen.getByText('The Black Demon')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'The' } });
      await waitFor(() => {
        expect(screen.getByText('The Little Mermaid')).toBeInTheDocument();
        expect(screen.getByText('The Covenant')).toBeInTheDocument();
        expect(screen.getByText('The Black Demon')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'The C' } });
      await waitFor(() => {
        expect(screen.getByText('The Covenant')).toBeInTheDocument();
        expect(screen.queryByText('The Little Mermaid')).not.toBeInTheDocument();
      });
    });
  });

  describe('Estructura y clases CSS', () => {
    test('tiene la estructura correcta de contenedores', () => {
      render(<Principal />);

      expect(screen.getByTestId('searchbar').closest('.header')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-infinito').closest('.carrusel-banner')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-estatico').closest('.static-carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('carrousel-screen').closest('.movie-carousel-section')).toBeInTheDocument();
    });

    test('aplica clases CSS correctas', () => {
      render(<Principal />);

      const appContainer = screen.getByTestId('carrusel-infinito').closest('.app-container');
      expect(appContainer).toBeInTheDocument();

      const navbar = screen.getByAltText('Logo').closest('.navbar');
      expect(navbar).toBeInTheDocument();

      const brand = screen.getByText('Spitting').closest('.brand');
      expect(brand).toBeInTheDocument();
    });
  });

  describe('Interacciones del usuario', () => {
    test('el menú se puede abrir y cerrar múltiples veces', () => {
      render(<Principal />);

      const menuButton = screen.getByText('☰');

      // Abrir y cerrar varias veces
      for (let i = 0; i < 3; i++) {
        fireEvent.click(menuButton);
        expect(screen.getByTestId('link-categories')).toBeInTheDocument();
        
        fireEvent.click(menuButton);
        expect(screen.queryByTestId('link-categories')).not.toBeInTheDocument();
      }
    });

    test('maneja búsquedas complejas correctamente', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      
      // Buscar por múltiples criterios
      fireEvent.change(searchInput, { target: { value: 'Action' } });
      await waitFor(() => {
        expect(screen.getByText('The Covenant')).toBeInTheDocument();
      });

      // Cambiar a búsqueda por título
      fireEvent.change(searchInput, { target: { value: '65' } });
      await waitFor(() => {
        expect(screen.getByText('65')).toBeInTheDocument();
        expect(screen.queryByText('The Covenant')).not.toBeInTheDocument();
      });
    });
  });
});
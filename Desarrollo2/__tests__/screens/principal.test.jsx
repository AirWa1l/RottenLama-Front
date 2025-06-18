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

jest.mock('../../src/components/LogoutButton/logoutButton.jsx', () => {
  return function LogoutButton() {
    return <button data-testid="logout-button">Logout</button>;
  };
});

jest.mock('../../src/components/SearchBar/Searchbar.jsx', () => {
  const PropTypes = require('prop-types');
  function Searchbar({ onSearch }) {
    return (
      <input
        data-testid="searchbar"
        placeholder="Search movies..."
        onChange={(e) => onSearch(e.target.value)}
      />
    );
  }
  Searchbar.propTypes = {
    onSearch: PropTypes.func,
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

      // Carruseles
      expect(screen.getByTestId('carrusel-infinito')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-estatico')).toBeInTheDocument();
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
      expect(imagesCount).toHaveTextContent('4'); // 4 imágenes en el array
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
    test('no muestra resultados inicialmente', () => {
      render(<Principal />);

      expect(screen.queryByText(/Resultados de/)).not.toBeInTheDocument();
    });

    test('muestra resultados cuando se realiza una búsqueda', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'Inception' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "Inception"')).toBeInTheDocument();
        expect(screen.getByText('Inception')).toBeInTheDocument();
      });
    });

    test('filtra correctamente las películas', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'Matrix' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "Matrix"')).toBeInTheDocument();
        expect(screen.getByText('The Matrix')).toBeInTheDocument();
        expect(screen.queryByText('Inception')).not.toBeInTheDocument();
      });
    });

    test('búsqueda es case-insensitive', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'PULP' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "PULP"')).toBeInTheDocument();
        expect(screen.getByText('Pulp Fiction')).toBeInTheDocument();
      });
    });

    test('muestra mensaje cuando no hay resultados', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'NonExistentMovie' } });

      await waitFor(() => {
        expect(screen.getByText('Resultados de "NonExistentMovie"')).toBeInTheDocument();
        expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument();
      });
    });

    test('muestra múltiples resultados cuando coinciden', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      fireEvent.change(searchInput, { target: { value: 'i' } }); // Buscar letra 'i'

      await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('Pulp Fiction')).toBeInTheDocument();
        expect(screen.getByText('Interstellar')).toBeInTheDocument();
        expect(screen.getByText('Fight Club')).toBeInTheDocument();
      });
    });

    test('limpia los resultados cuando se borra la búsqueda', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      
      // Realizar búsqueda
      fireEvent.change(searchInput, { target: { value: 'Matrix' } });
      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument();
      });

      // Limpiar búsqueda
      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.queryByText(/Resultados de/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Estructura y clases CSS', () => {
    test('tiene la estructura correcta de contenedores', () => {
      render(<Principal />);

      expect(screen.getByTestId('searchbar').closest('.header')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-infinito').closest('.carrusel-banner')).toBeInTheDocument();
      expect(screen.getByTestId('carrusel-estatico').closest('.static-carousel-container')).toBeInTheDocument();
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

    test('searchbar responde a cambios continuos', async () => {
      render(<Principal />);

      const searchInput = screen.getByTestId('searchbar');
      
      // Simular escritura gradual
      fireEvent.change(searchInput, { target: { value: 'I' } });
      await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'In' } });
      await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('Interstellar')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'Inc' } });
      await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.queryByText('Interstellar')).not.toBeInTheDocument();
      });
    });
  });
});
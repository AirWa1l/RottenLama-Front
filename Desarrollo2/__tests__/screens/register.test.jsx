import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../../src/screens/registerScreen/register';

// Mocks
jest.mock('react-router-dom', () => {
  const PropTypes = require('prop-types');
  function Link({ children, to }) {
    return <a href={to}>{children}</a>;
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

jest.mock('../../src/API/auth.js', () => ({
  __esModule: true,
  default: () => ({
    register: jest.fn(() => Promise.resolve())
  })
}));

jest.mock('../../src/components/particles/particles', () => {
  return function AnimatedBackground() {
    return <div data-testid="animated-background" />;
  };
});

describe('Register Screen', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario de registro', () => {
    render(<Register />);

    expect(screen.getByText('Become a Cinephile')).toBeInTheDocument();
    expect(screen.getByText('Look for the best-reviewed movies and save your favorites for later!')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  test('maneja cambios en los inputs correctamente', () => {
    render(<Register />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('muestra enlace de login', () => {
    render(<Register />);
    
    expect(screen.getByText('Have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  test('renderiza componente AnimatedBackground', () => {
    render(<Register />);
    
    expect(screen.getByTestId('animated-background')).toBeInTheDocument();
  });

  test('muestra botones de redes sociales', () => {
    render(<Register />);
    
    expect(screen.getByText('Or sign up with')).toBeInTheDocument();
    
    const socialButtons = screen.getAllByRole('button');
    const socialButtonsCount = socialButtons.filter(btn => 
      btn.className.includes('icon-btn')
    ).length;
    
    expect(socialButtonsCount).toBe(3); // Google, GitHub, Twitter
  });
  
  test('renderiza logo', () => {
    render(<Register />);
      
    const logoContainer = screen.getByText('Become a Cinephile').closest('header');
    const logo = logoContainer.querySelector('img[alt="Logo"]');
  
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Logo');
  });
  
  test('previene submit con campos vacíos', async () => {
    const mockRegister = jest.fn();
        
    // Mock del hook useAuth para interceptar el register
    jest.doMock('../../src/API/auth.js', () => ({
        __esModule: true,
        default: () => ({
        register: mockRegister
        })
  }));
    
    render(<Register />);
    
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);
    
    // Esperar y verificar que NO se llamó register
    await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
    }, { timeout: 1000 });
    
    // Verificar que los campos siguen vacíos (no se envió)
    expect(screen.getByPlaceholderText('Username').value).toBe('');
    expect(screen.getByPlaceholderText('Email Address').value).toBe('');
    });

  test('valida que las contraseñas coincidan', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Register />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    // Llenar campos con contraseñas diferentes
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Passwords do not match.');
    
    alertSpy.mockRestore();
  });

  test('muestra estado de carga durante el registro', async () => {
    render(<Register />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    // Llenar todos los campos
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    // El botón debería mostrar "Registering..." temporalmente
    await waitFor(() => {
      expect(screen.getByText('Registering...')).toBeInTheDocument();
    });
  });

  test('renderiza sin errores', () => {
    expect(() => render(<Register />)).not.toThrow();
  });

  test('tiene todos los campos requeridos', () => {
    render(<Register />);
    
    const requiredInputs = screen.getAllByRole('textbox', { required: true });
    const passwordInputs = screen.getAllByDisplayValue(''); // Inputs vacíos inicialmente
    
    // Debería tener 4 campos obligatorios (username, email, password, confirmPassword)
    expect(requiredInputs.length + passwordInputs.filter(input => 
      input.type === 'password'
    ).length).toBeGreaterThanOrEqual(4);
  });
});
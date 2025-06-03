import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock completo de react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn()
}));

// Mock de SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}));

// Mock de componentes personalizados
jest.mock('../../src/components/particles/particles', () => {
  return function WavesBackground() {
    return <div data-testid="waves-background" />;
  };
});

// Mock del contexto de autenticación
jest.mock('../../src/API/authContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn()
  })
}));

// Importar el componente después de los mocks
import Login from '../../src/screens/loginScreen/login';

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows register link', () => {
    render(<Login />);
    
    expect(screen.getByText("Don't you have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  test('shows recovery link', () => {
    render(<Login />);
    
    expect(screen.getByRole('link', { name: /recover password/i })).toBeInTheDocument();
  });
});
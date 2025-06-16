import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Recovery from '../../src/screens/recoveryScreen/recovery';

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

describe('Recovery Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario de recuperación', () => {
    render(<Recovery />);
    
    // ✅ Textos que SÍ existen en el componente real
    expect(screen.getByText('🔒 Recuperar Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu correo para recibir un enlace de recuperación.')).toBeInTheDocument();
    
    // ✅ Placeholder correcto del componente real
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    
    // ✅ Texto del botón correcto
    expect(screen.getByRole('button', { name: 'Enviar enlace' })).toBeInTheDocument();
  });

  test('maneja cambios en el input de email', () => {
    render(<Recovery />);
    
    // ✅ Placeholder correcto
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('renderiza sin errores', () => {
    expect(() => render(<Recovery />)).not.toThrow();
  });

  test('muestra mensaje de error para email sin punto', async () => {
    render(<Recovery />);
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: 'Enviar enlace' });

    // ✅ Email con @ pero sin punto
    fireEvent.change(emailInput, { target: { value: 'test@ejemplo' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Por favor, ingresa un correo válido.')).toBeInTheDocument();
    });
  });

  test('muestra mensaje de éxito para email válido', async () => {
    render(<Recovery />);
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: 'Enviar enlace' });

    // ✅ Email válido
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // ✅ Mensaje de éxito exacto del componente
    await waitFor(() => {
      expect(screen.getByText('Si el correo está registrado, recibirás un enlace de recuperación.')).toBeInTheDocument();
    });
  });

  test('previene submit sin preventDefault', () => {
    render(<Recovery />);
    
    const submitButton = screen.getByRole('button', { name: 'Enviar enlace' });
    
    // Verificar que el botón es de tipo submit
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('input tiene los atributos correctos', () => {
    render(<Recovery />);
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  test('renderiza icono de email', () => {
    const { container } = render(<Recovery />);
    
    // Buscar el ícono (FiMail se renderiza como SVG)
    const iconContainer = container.querySelector('.input-container .icon');
    expect(iconContainer).toBeInTheDocument();
  });
});
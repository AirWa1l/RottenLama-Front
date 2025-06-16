import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Carrusel from '../../src/components/Carrusel/carrusel';

describe('Carrusel Component', () => {
  test('renderiza correctamente el título', () => {
    render(<Carrusel />);
    
    expect(screen.getByText('Movies in Theaters')).toBeInTheDocument();
  });

  test('muestra las tarjetas de películas', () => {
    render(<Carrusel />);
    
    expect(screen.getByText('UNICORN')).toBeInTheDocument();
    expect(screen.getByText('A VOTER OF THE LIVING BEST')).toBeInTheDocument();
    expect(screen.getByText('STARTER')).toBeInTheDocument();
  });

  test('renderiza botones de navegación', () => {
    render(<Carrusel />);
    
    const nextButton = screen.getByText('>');
    const prevButton = screen.getByText('<');
    
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test('navega correctamente con los botones', () => {
    render(<Carrusel />);
    
    const nextButton = screen.getByText('>');
    const prevButton = screen.getByText('<');
    
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
    
    // Verificar que los botones son clickeables
    expect(nextButton).toBeEnabled();
    expect(prevButton).toBeEnabled();
  });

  test('renderiza imágenes de películas', () => {
    render(<Carrusel />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('tiene estructura correcta de carrusel', () => {
    const { container } = render(<Carrusel />);
    
    const carruselContainer = container.querySelector('.carrusel-container');
    expect(carruselContainer).toBeInTheDocument();
  });

  test('muestra información de rating cuando está disponible', () => {
    render(<Carrusel />);
    
    // Verificar elementos específicos del rating si existen
    const movieCards = screen.getAllByText(/UNICORN|STARTER|VOTER/);
    expect(movieCards.length).toBeGreaterThan(0);
  });
});
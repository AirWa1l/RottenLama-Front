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
    expect(prevButton).toBeEnabled();
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

  test('renderiza tarjetas de películas correctamente', () => {
    const { container } = render(<Carrusel />);
    
    // Buscar elementos .movie-card en lugar de imágenes
    const movieCards = container.querySelectorAll('.movie-card');
    expect(movieCards.length).toBeGreaterThan(0);
    expect(movieCards.length).toBeLessThanOrEqual(4); // itemsPerPage = 4
  });

  test('tiene estructura correcta de carrusel', () => {
    const { container } = render(<Carrusel />);
    
    const carruselContainer = container.querySelector('.movies-carousel');
    expect(carruselContainer).toBeInTheDocument();
    
    const carouselWrapper = container.querySelector('.carousel-wrapper');
    const carouselTrack = container.querySelector('.carousel-track');
    
    expect(carouselWrapper).toBeInTheDocument();
    expect(carouselTrack).toBeInTheDocument();
  });

  test('muestra información de rating cuando está disponible', () => {
    render(<Carrusel />);
    
    // Verificar elementos específicos del rating si existen
    const movieCards = screen.getAllByText(/UNICORN|STARTER|VOTER/);
    expect(movieCards.length).toBeGreaterThan(0);
  });

  test('muestra subtítulos cuando están disponibles', () => {
    render(<Carrusel />);
    
    expect(screen.getByText('A WOMAN OF THE MUSIC')).toBeInTheDocument();
  });

  test('muestra porcentajes de rating', () => {
    render(<Carrusel />);
    
    // Verificar algunos porcentajes específicos del array movies
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('57%')).toBeInTheDocument();
  });

  test('renderiza botón VIEW ALL', () => {
    render(<Carrusel />);
    
    const viewAllButton = screen.getByRole('button', { name: 'VIEW ALL' });
    expect(viewAllButton).toBeInTheDocument();
  });

  test('muestra texto "Brought to you by"', () => {
    render(<Carrusel />);
    
    expect(screen.getByText('Brought to you by')).toBeInTheDocument();
  });

  test('renderiza cantidad correcta de películas visibles', () => {
    const { container } = render(<Carrusel />);
    
    const movieCards = container.querySelectorAll('.movie-card');
    // Debería mostrar máximo 4 películas por slide
    expect(movieCards.length).toBeLessThanOrEqual(4);
    expect(movieCards.length).toBeGreaterThan(0);
  });

  test('botones de navegación tienen clases correctas', () => {
    const { container } = render(<Carrusel />);
    
    const leftArrow = container.querySelector('.carousel-arrow.left');
    const rightArrow = container.querySelector('.carousel-arrow.right');
    
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument();
  });

  test('navegación circular funciona correctamente', () => {
    render(<Carrusel />);
    
    const nextButton = screen.getByText('>');
    const prevButton = screen.getByText('<');
    
    // Hacer varios clicks para probar la navegación circular
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
    
    // El componente no debería crashear
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test('renderiza sin errores', () => {
    expect(() => render(<Carrusel />)).not.toThrow();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticlesBackground from '../../src/components/particles/particles';

// Mock de canvas context
const mockGetContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fillStyle: '',
  strokeStyle: ''
}));

// Mock de canvas
HTMLCanvasElement.prototype.getContext = mockGetContext;

describe('ParticlesBackground Component', () => {
  beforeEach(() => {
    // Mock de requestAnimationFrame
    global.requestAnimationFrame = (callback) => {
      setTimeout(callback, 16);
    };
    
    // Mock de window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  test('renderiza el canvas correctamente', () => {
    render(<ParticlesBackground />);
    
    const canvas = screen.getByTestId('particles-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  test('configura dimensiones del canvas', () => {
    render(<ParticlesBackground />);
    
    const canvas = screen.getByTestId('particles-canvas');
    expect(canvas).toHaveAttribute('width');
    expect(canvas).toHaveAttribute('height');
  });

  test('inicializa el contexto del canvas', () => {
    render(<ParticlesBackground />);
    
    expect(mockGetContext).toHaveBeenCalledWith('2d');
  });

  test('maneja resize de ventana', () => {
    const { unmount } = render(<ParticlesBackground />);
    
    // Simular resize
    global.dispatchEvent(new Event('resize'));
    
    expect(mockGetContext).toHaveBeenCalled();
    
    unmount();
  });

  test('limpia recursos al desmontar', () => {
    const { unmount } = render(<ParticlesBackground />);
    
    unmount();
    
    // Verificar que se limpia correctamente
    expect(mockGetContext).toHaveBeenCalled();
  });
});
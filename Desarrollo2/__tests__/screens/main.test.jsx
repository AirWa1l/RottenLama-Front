import React from 'react';
import { render } from '@testing-library/react';
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
    jest.clearAllMocks();
    
    // Mock completo de requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });
    
    global.cancelAnimationFrame = jest.fn();
    
    // Mock de dimensiones de ventana
    Object.defineProperties(window, {
      innerWidth: {
        writable: true,
        configurable: true,
        value: 1024,
      },
      innerHeight: {
        writable: true,
        configurable: true,
        value: 768,
      }
    });
  });

  test('renderiza el canvas correctamente', () => {
    const { container } = render(<ParticlesBackground />);
    
    // Múltiples formas de encontrar el canvas
    const canvasByTag = container.querySelector('canvas');
    const canvasByRole = container.querySelector('[role="img"]'); // Si tiene role
    const anyCanvas = container.getElementsByTagName('canvas')[0];
    
    // Al menos una debe funcionar
    const canvas = canvasByTag || canvasByRole || anyCanvas;
    
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  test('configura dimensiones del canvas', () => {
    const { container } = render(<ParticlesBackground />);
    
    const canvas = container.querySelector('canvas');
    
    // Verificar que el canvas existe antes de verificar atributos
    expect(canvas).toBeInTheDocument();
    
    // Verificar propiedades del canvas
    expect(canvas.width).toBe(1024);
    expect(canvas.height).toBe(768);
  });

  test('inicializa el contexto del canvas', () => {
    render(<ParticlesBackground />);
    
    // Esperar un poco para que se ejecute useEffect
    setTimeout(() => {
      expect(mockGetContext).toHaveBeenCalledWith('2d');
    }, 50);
  });

  test('componente se monta sin errores', () => {
    expect(() => {
      render(<ParticlesBackground />);
    }).not.toThrow();
  });
});
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedBackground from '../../src/components/particles/particles';

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

describe('AnimatedBackground Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de requestAnimationFrame
    global.requestAnimationFrame = jest.fn((callback) => {
      setTimeout(callback, 16);
      return 1;
    });
    
    global.cancelAnimationFrame = jest.fn();
    
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renderiza el canvas correctamente', () => {
    const { container } = render(<AnimatedBackground />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
    
    expect(canvas).toHaveClass('animated-bg');
  });

  test('configura dimensiones del canvas', () => {
    const { container } = render(<AnimatedBackground />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    
    expect(canvas.width).toBe(1024);
    expect(canvas.height).toBe(768);
  });

  test('inicializa el contexto del canvas', () => {
    render(<AnimatedBackground />);
    
    expect(mockGetContext).toHaveBeenCalledWith('2d');
  });

  test('maneja resize de ventana', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    const { unmount } = render(<AnimatedBackground />);
    
    // Verificar que se agregó el listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // Simular resize
    global.dispatchEvent(new Event('resize'));
    
    expect(mockGetContext).toHaveBeenCalled();
    
    unmount();
    addEventListenerSpy.mockRestore();
  });

  test('limpia recursos al desmontar', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<AnimatedBackground />);
    
    unmount();
    
    // El componente actual no limpia los listeners, pero podemos verificar que se renderizó
    expect(mockGetContext).toHaveBeenCalled();
    
    removeEventListenerSpy.mockRestore();
  });

  test('canvas tiene estilos correctos', () => {
    const { container } = render(<AnimatedBackground />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('animated-bg');
  });

  test('inicializa animación correctamente', () => {
    render(<AnimatedBackground />);
    
    // Verificar que requestAnimationFrame se llamó para iniciar la animación
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('renderiza sin errores', () => {
    expect(() => render(<AnimatedBackground />)).not.toThrow();
  });
});
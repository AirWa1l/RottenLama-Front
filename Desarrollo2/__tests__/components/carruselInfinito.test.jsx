import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarruselInfinito from '../../src/components/Carrusel/carruselInfinito';


describe('CarruselInfinito Component', () => {
    const sampleImages = [
        '/images/img1.jpg',
        '/images/img2.jpg',
        '/images/img3.jpg',
        '/images/img4.jpg'
    ];

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renderiza correctamente con imágenes', () => {
        render(<CarruselInfinito images={sampleImages} />);
        
        // Verificar elementos principales
        expect(screen.getByTestId('carrusel-container')).toBeInTheDocument();
        expect(screen.getByTestId('carrusel')).toBeInTheDocument();
        
        // Verificar número de imágenes (duplicadas)
        const images = screen.getAllByTestId(/^carrusel-item-/);
        expect(images).toHaveLength(sampleImages.length * 2);
        
        // Verificar que las imágenes tienen los textos alternativos correctos
        sampleImages.forEach((_, index) => {
            const altText = `Carrusel item ${index + 1}`;
            const foundImages = screen.getAllByAltText(altText);
            expect(foundImages.length).toBe(2);
        });
    });

    test('maneja correctamente el caso sin imágenes', () => {
        render(<CarruselInfinito images={[]} />);
        
        expect(screen.getByTestId('carrusel-container-empty')).toBeInTheDocument();
        expect(screen.queryByTestId('carrusel')).not.toBeInTheDocument();
    });

    test('aplica la animación CSS correctamente', () => {
        const { container } = render(<CarruselInfinito images={sampleImages} />);
        const carrusel = container.querySelector('.carrusel');
        
        expect(carrusel).toHaveStyle('animation: scroll 10s linear infinite');
    });

    test('no aplica animación cuando no hay imágenes', () => {
        const { container } = render(<CarruselInfinito images={[]} />);
        const carrusel = container.querySelector('.carrusel');
        
        expect(carrusel).toBeNull();
    });
});
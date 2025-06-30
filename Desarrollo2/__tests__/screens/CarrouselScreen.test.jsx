import { getAllByAltText, render, screen } from '@testing-library/react';
import CarrouselScreen from '../../src/screens/carrouselScreen/carrouselScreen';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';

describe('CarrouselScreen', () => {

    test('renders CarrouselScreen component', () => {
        render(<CarrouselScreen />);

        // Verify the screen is rendered
        const screenElement = screen.getByRole("carrousel-screen");
        expect(screenElement).toBeInTheDocument();


        // Verify the banner is rendered (usando role correcto)
        const banners = screen.getAllByRole("banner");
        const movieBanner = banners.find(banner => banner.className.includes("banner"));
        expect(movieBanner).toBeInTheDocument();

        // Verify the carousel is rendered
        const carousel = screen.getByRole("carousel-box");
        expect(carousel).toBeInTheDocument();
    });

    test('renders review click correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
        render(<CarrouselScreen />);
        
        // Verificar que el botón Reviews existe
        const reviewsButtons = screen.getAllByRole("link", { name: "Reviews" });
        const reviewsButton = reviewsButtons[0];
        expect(reviewsButton).toBeInTheDocument();
        
        // Hacer clic en el botón Reviews
        await userEvent.click(reviewsButton);
        
        // Verificar que se ejecutó console.log (opcional)
        expect(consoleSpy).toHaveBeenCalledWith("Go to reviews for the-little-mermaid");
        
        // Limpiar el spy
        consoleSpy.mockRestore();
    });

    test('renders add to list correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
        render(<CarrouselScreen />);
        
        // Verificar que el botón My List existe
        const addToListButtons = screen.getAllByRole("link", { name: "My List" });
        const addToListButton = addToListButtons[0];
        expect(addToListButton).toBeInTheDocument();
        
        // Hacer clic en el botón My List
        await userEvent.click(addToListButton);
        
        // Verificar que se ejecutó console.log (opcional)
        expect(consoleSpy).toHaveBeenCalledWith("Added the-little-mermaid to list");
        
        // Limpiar el spy
        consoleSpy.mockRestore();
        
    });

    test('changes bg image correctly', async () => {
        render(<CarrouselScreen />);
        
        // Hacer clic en la imagen del carrusel
        const covenantImages = screen.getAllByAltText("The Covenant");
        const carouselImage = covenantImages.find(img => 
            img.src.includes('/movies/the-covenant.jpg')
        );
        
        // Hacer clic en el padre (div con onClick)
        await userEvent.click(carouselImage.parentElement);
        
        expect(screen.getByTestId("movie-content-the-covenant")).toHaveClass("content the-covenant");
    });

});
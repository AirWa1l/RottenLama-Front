import { render, screen } from '@testing-library/react';
import MovieCarousel from '../../src/components/MovieCarrousel/MovieCarrousel';
import React from 'react';

describe('MovieCarousel', () => {

    test('renders MovieCarousel component', () => {

        const mockonMovieSelect = jest.fn();
        const mockMovies = [
            {
                id: "the-covenant",
                title: "The Covenant",
                backgroundImage: "bg-the-covenant.jpeg",
                thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-covenant.jpg",
                alt: "The Covenant"
            },
            {
                id: "the-tank",
                title: "The Tank", 
                backgroundImage: "bg-the-tank.jpeg",
                thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-tank.jpeg",
                alt: "The Tank"
            }
        ];

        render (<MovieCarousel 
            movies={mockMovies} 
            onMovieSelect={mockonMovieSelect}
        />);

        // Verify the carousel is rendered
        const carouselElement = screen.getByRole("carousel-box");
        expect(carouselElement).toBeInTheDocument();
        
        // Verify the images are rendered
        const covenantImage = screen.getByAltText("The Covenant");
        const tankImage = screen.getByAltText("The Tank");

        expect(covenantImage).toBeInTheDocument();
        expect(tankImage).toBeInTheDocument();

        // Verify the images have the correct src
        expect(covenantImage).toHaveAttribute("src", "/movie/movie-website-landing-page-images/movies/the-covenant.jpg");
        expect(tankImage).toHaveAttribute("src", "/movie/movie-website-landing-page-images/movies/the-tank.jpeg");
    });

});


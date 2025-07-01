import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieBanner from '../../src/components/MovieBanner/MovieBanner';


describe("MovieBanner", () => {

    test("renders the movie banner", () => {
        const mockMovies = [
            {
                id: "65",
                title: "65",
                titleImage: "/movie/movie-website-landing-page-images/the-65-title.png",
                year: "2023",
                rating: "12+",
                duration: "1h 33min",
                genre: "Thriller",
                description: "After a catastrophic crash on an unknown planet, pilot Mills quickly discovers he's stranded on Earth... 65 million years ago. Now, with only one chance at rescue, Mills and the sole other survivor, Koa, must traverse an unknown terrain riddled with dangerous prehistoric creatures in an epic fight to survive."
            }
        ];
        render(<MovieBanner 
            backgroundImage="bg-65.jpeg"
            movies={mockMovies}
            activeMovieId={65}
            onReviewClick={() => {}}
            onAddToList={() => {}}
        />);
        
        // Verify the banner element is rendered
        const bannerElement = screen.getByRole("banner");
        expect(bannerElement).toBeInTheDocument();
        
        // Verify the banner has the correct background image
        expect(bannerElement).toHaveStyle({
            backgroundImage: "url(bg-65.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center"
        });

        // Verify the movieContent is rendered
        const movieContent = screen.getByTestId('movie-content-65');
        expect(movieContent).toBeInTheDocument();
                
    });

    /*
    test("renders movieContent components for all movies", () => {

    });

    test("passes correct isActive prop to MovieContent", () => {

    });

    test("pases correct props to MovieContent", () => {

    });
    */
});
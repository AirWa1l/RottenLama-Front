import { render, screen } from '@testing-library/react';
import CarrouselItem from '../../src/components/CarrouselItem/CarrouselItem';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('CarrouselItem', () => {

//Render, interact, callback function
    test("CarrouselItem render test", async () => {

        const mockonMovieSelect = jest.fn();

        render(<CarrouselItem movie={{
            id: "the-covenant",
            backgroundImage:"bg-the-covenant.jpeg",
            thumbnailImage: "/movie/movie-website-landing-page-images/movies/the-covenant.jpg",
            alt: "The Covenant"
        }} onMovieSelect={mockonMovieSelect}/>);

        const movieItem = screen.getByAltText("The Covenant");
        expect(movieItem).toBeInTheDocument();

        await userEvent.click(movieItem);// es mas adecuado usar onMovieSelect?
        expect(mockonMovieSelect).toHaveBeenCalledWith("bg-the-covenant.jpeg","the-covenant");

    });
})
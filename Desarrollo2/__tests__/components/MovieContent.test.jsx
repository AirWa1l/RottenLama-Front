import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieContent from '../../src/components/MovieContent/MovieContent';
import userEvent from '@testing-library/user-event';

describe("MovieContent", () => {

    const movieData = {
        id: "the-thank",
        title: "The Tank",
        titleImage: "/movie/movie-website-landing-page-images/the-tank-title.png",
        year: "2023",
        rating: "12+",
        duration: "1h 40min",
        genre: "Thriller",
        description: "After inheriting a mysterious abandoned property, a family accidentally unleashes a long-dormant creature that terrorized the local area, including their ancestors, for generations."
    }

    test("renders the movie content", () => {

        render(<MovieContent 
            movie={movieData} 
            isActive={true} 
            onReviewClick={() => {}} 
            onAddToList={() => {}} 
        />);
        
        //Verify the movie content is rendered
        const MovieContentElement = screen.getByTestId(`movie-content-${movieData.id}`);
        expect(MovieContentElement).toBeInTheDocument();

        //Verify the title image is rendered
        const titleImage = screen.getByAltText("The Tank");
        expect(titleImage).toBeInTheDocument();
        expect(titleImage).toHaveAttribute("src", "/movie/movie-website-landing-page-images/the-tank-title.png");

        //Verify the title is rendered
        const title = screen.getByAltText("The Tank");
        expect(title).toBeInTheDocument();

        // verify the metadata is rendered
        expect(screen.getByText("2023")).toBeInTheDocument();
        expect(screen.getByText("12+")).toBeInTheDocument();
        expect(screen.getByText("1h 40min")).toBeInTheDocument();
        expect(screen.getByText("Thriller")).toBeInTheDocument();

        //Verify the description is rendered
        const description = screen.getByText("After inheriting a mysterious abandoned property, a family accidentally unleashes a long-dormant creature that terrorized the local area, including their ancestors, for generations.");
        expect(description).toBeInTheDocument();
        
        //Verify the review button is rendered
        const reviewButton = screen.getByText("Reviews");
        expect(reviewButton).toBeInTheDocument();

        //Verify the add to list button is rendered
        const addToListButton = screen.getByText("My List");
        expect(addToListButton).toBeInTheDocument();
        
    });

    test("does not apply active class when isAcrive is false", () => {
        // Renderizar con isActive = false
       
        render(<MovieContent 
            movie={movieData} 
            isActive={false} 
            onReviewClick={() => {}} 
            onAddToList={() => {}} 
        />);
         // Verificar que NO tiene la clase 'active'
         const movieContentElement = screen.getByTestId(`movie-content-${movieData.id}`);

         expect(movieContentElement).not.toHaveClass("active");
    });

    test("calls onReviewClick when review button is clicked", async () => {
        const mockOnReviewClick = jest.fn();
        render(<MovieContent 
            movie={movieData} 
            isActive={true} 
            onReviewClick={mockOnReviewClick} 
            onAddToList={() => {}} 
        />);

        const reviewButton = screen.getByText("Reviews");
        await userEvent.click(reviewButton);

        expect(mockOnReviewClick).toHaveBeenCalledWith(movieData.id);
    });

    test("calls onAddToList when review button is clicked", async () => {
        const mockOnAddToList = jest.fn();
        render(<MovieContent 
            movie={movieData} 
            isActive={true} 
            onReviewClick={() => {}} 
            onAddToList={mockOnAddToList} 
        />);

        const onAddButton = screen.getByText("My List");
        await userEvent.click(onAddButton );

        expect(mockOnAddToList).toHaveBeenCalledWith(movieData.id);
    });
})


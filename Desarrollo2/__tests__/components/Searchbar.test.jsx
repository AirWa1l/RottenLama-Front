import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Searchbar from "../../src/components/SearchBar/searchbar.jsx";

describe("Searchbar", () => {
  test("renderiza el input y el botón de búsqueda", () => {
    render(<Searchbar onSearch={() => {}} />);

    // Verifica que se renderiza el input
    const input = screen.getByPlaceholderText(/buscar películas/i);
    expect(input).toBeInTheDocument();

    // Verifica que se renderiza el botón
    const button = screen.getByRole("button", { name: /buscar/i });
    expect(button).toBeInTheDocument();
  });

  test("llama a onSearch con el texto ingresado al hacer submit", () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/buscar películas/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("Inception");
  });
});

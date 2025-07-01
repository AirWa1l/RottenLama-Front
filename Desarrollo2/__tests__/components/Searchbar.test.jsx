import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Searchbar from "../../src/components/SearchBar/Searchbar";

describe("Searchbar component", () => {
  const mockSearch = jest.fn();
  const mockSuggestions = [
    "Inception",
    "Interstellar",
    "The Matrix",
    "Pulp Fiction",
    "Fight Club"
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente el input", () => {
    render(<Searchbar onSearch={mockSearch} suggestions={mockSuggestions} />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  test("muestra sugerencias filtradas al escribir", () => {
    render(<Searchbar onSearch={mockSearch} suggestions={mockSuggestions} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "in" } });

    expect(mockSearch).toHaveBeenCalledWith("in");
    expect(screen.getByTestId("suggestion-list")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  test("no muestra sugerencias si no hay coincidencias", () => {
    render(<Searchbar onSearch={mockSearch} suggestions={mockSuggestions} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "zzzzz" } });

    expect(mockSearch).toHaveBeenCalledWith("zzzzz");
    expect(screen.queryByTestId("suggestion-list")).not.toBeInTheDocument();
  });

  test("seleccionar sugerencia actualiza el input y oculta la lista", () => {
    render(<Searchbar onSearch={mockSearch} suggestions={mockSuggestions} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "f" } });

    const suggestion = screen.getByText("Fight Club");
    fireEvent.click(suggestion);

    expect(input.value).toBe("Fight Club");
    expect(mockSearch).toHaveBeenCalledWith("Fight Club");
    expect(screen.queryByTestId("suggestion-list")).not.toBeInTheDocument();
  });

  test("el filtrado es case-insensitive", () => {
    render(<Searchbar onSearch={mockSearch} suggestions={mockSuggestions} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "PULP" } });

    expect(screen.getByText("Pulp Fiction")).toBeInTheDocument();
  });
});
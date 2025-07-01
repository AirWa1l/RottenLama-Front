import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoriesScreen from "../../src/screens/categoriesScreen/categoriesScreen";

// Mock de useAuth
jest.mock("../../src/API/auth", () => ({
  __esModule: true,
  default: () => ({ 
    user: null,
    logout: jest.fn() 
  }),
}));

// Mock del componente SearchBar
jest.mock("../../src/components/SearchBar/Searchbar", () => {
  return function Searchbar() {
    return (
      <div data-testid="searchbar">
        <input 
          placeholder="Search movies..."
          data-testid="search-input"
        />
      </div>
    );
  };
});

// Mock de LogoutButton
jest.mock("../../src/components/LogoutButton/logoutButton", () => {
  return function LogoutButton() {
    return <button data-testid="logout-button">Logout</button>;
  };
});

// Mock para la imagen del logo
jest.mock("../../src/assets/logo.png", () => "test-file-stub");

describe("CategoriesScreen", () => {
  const mockCategories = [
    { name: "Action", emoji: "🔥" },
    { name: "Comedy", emoji: "😂" },
    { name: "Drama", emoji: "🎭" },
    { name: "Sci-Fi", emoji: "🚀" },
    { name: "Romance", emoji: "❤️" },
    { name: "Horror", emoji: "👻" },
    { name: "Thriller", emoji: "🔪" },
    { name: "Animation", emoji: "🎬" }
  ];

  test("renders the categories screen with title and description", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    expect(screen.getByText("Movie Categories")).toBeInTheDocument();
    expect(
      screen.getByText("Select a genre and discover awesome films!")
    ).toBeInTheDocument();
  });

  test("shows all category cards", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(screen.getByText(category.emoji)).toBeInTheDocument();
    });
  });

  test("shows search bar", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    expect(screen.getByTestId("searchbar")).toBeInTheDocument();
  });

  test("shows auth buttons when not logged in", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
  });

  test("shows logout button when logged in", () => {
    // Mock para usuario autenticado
    jest.spyOn(require("../../src/API/auth"), "default").mockImplementation(() => ({
      user: { id: 1, username: "testuser" },
      logout: jest.fn()
    }));

    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.queryByText("Register")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("menu toggle works", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("My Reviews")).toBeInTheDocument();
  });
});
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoriesScreen from "src/screens/categoriesScreen/categoriesScreen";
import { MemoryRouter } from "react-router-dom";

// Mock de useAuth
jest.mock("src/API/auth", () => ({
  __esModule: true,
  default: () => ({ user: null }),
}));

describe("CategoriesScreen", () => {
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

  test("shows predefined category options", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    const categories = [
      "Action",
      "Comedy",
      "Drama",
      "Sci-Fi",
      "Romance",
      "Horror",
      "Thriller",
      "Animation",
    ];

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test("navbar shows links and search bar", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText("Buscar películas...")
    ).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("menu toggle shows dropdown links", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /☰/i });
    fireEvent.click(button);

    // Espera que los textos aparezcan después de abrir el menú
    expect(screen.getByText("Categories")).toBeVisible();
    expect(screen.getByText("My Reviews")).toBeVisible();
    expect(screen.getByText("Coming Soon")).toBeVisible();
  });

  test("each category card has an emoji and name", () => {
    render(
      <MemoryRouter>
        <CategoriesScreen />
      </MemoryRouter>
    );

    const emojiElements = screen.getAllByText((content, element) =>
      element.tagName.toLowerCase() === "span" &&
      /🔥|😂|🎭|👻|🚀|❤️|🔪|🎬/.test(content)
    );
    expect(emojiElements.length).toBeGreaterThanOrEqual(8);
  });
});

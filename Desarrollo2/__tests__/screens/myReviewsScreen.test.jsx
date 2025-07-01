import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyReviewsScreen from "src/screens/myReviewsScreen/myReviewsScreen";

// Mock de useAuth
jest.mock("src/API/auth", () => ({
  __esModule: true,
  default: () => ({ user: { username: "Juan" } }),
}));

describe("MyReviewsScreen", () => {
  test("renders reviews screen with heading and sample reviews", () => {
    render(
      <MemoryRouter>
        <MyReviewsScreen />
      </MemoryRouter>
    );

    expect(screen.getByText("My Movie Reviews")).toBeInTheDocument();
    expect(screen.getByText(/These are your latest movie ratings and comments/i)).toBeInTheDocument();
    expect(screen.getByText("Minecraft: The Movie")).toBeInTheDocument();
    expect(screen.getByText("Oppenheimer")).toBeInTheDocument();
    expect(screen.getAllByText(/Juan/i).length).toBeGreaterThanOrEqual(2);
  });
});

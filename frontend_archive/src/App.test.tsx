import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

jest.mock('./components/routes/Routes', () => () => <div data-testid='routeCompo'>Mocked Routes component</div>);

describe("App", () => {
  it("App component renders", () => {

    render(<App />);

    expect(screen.getByTestId("routeCompo")).toBeInTheDocument();
  });
});

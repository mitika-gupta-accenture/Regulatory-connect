import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import { BackLink } from "../BackLink";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { Provider } from "react-redux";

jest.mock("../../../core/hooks/useNavigation", () => {
  return jest.fn(() => ({
    currentPageIndex: 1,
    nextPage: () => {},
    previousPage: () => {},
  }));
});

describe("BackLink component", () => {
  it("renders BackLink component", () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <BackLink />
        </MemoryRouter>
      </Provider>
    );

    const backLinkElement = getByText("Back");
    expect(backLinkElement).toBeInTheDocument();
  });

  it("should render PrevLink when currentPageIndex > 0", () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <BackLink />
        </MemoryRouter>
      </Provider>
    );
    const backButton = getByText("Back");

    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass("govuk-back-link");
  });
});

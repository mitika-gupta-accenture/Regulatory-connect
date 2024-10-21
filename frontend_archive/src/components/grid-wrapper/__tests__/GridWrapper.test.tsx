import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { GridWrapper } from "../GridWrapper";

describe("GridWrapper component", () => {
  it("renders GridWrapper and renders children", () => {
    const { getByText, container } = render(
        <Provider store={mockStore}>
            <Router>
                <GridWrapper>
                    <p>test paragraph</p>
                </GridWrapper>
            </Router>
        </Provider>
    );

    const testButton = getByText("test paragraph");
    expect(testButton).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("govuk-main-wrapper")
  });
});
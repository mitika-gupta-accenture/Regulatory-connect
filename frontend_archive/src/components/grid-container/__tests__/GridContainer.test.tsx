import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { GridContainer } from "../GridContainer";

describe("GridContainer component", () => {
  it("renders GridContainer and renders children", () => {
    const { getByText, container } = render(
        <Provider store={mockStore}>
            <Router>
                <GridContainer>
                    <p>test paragraph</p>
                </GridContainer>
            </Router>
        </Provider>
    );

    const testButton = getByText("test paragraph");
    expect(testButton).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("govuk-width-container app-width-container")
  });
});
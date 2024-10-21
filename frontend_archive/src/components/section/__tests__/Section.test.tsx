import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { Section } from "../Section";
import { BrowserRouter as Router } from "react-router-dom";

describe("Section", () => {
  it("renders with provided data", () => {
    const testData = {
      section: {
        name: "testSectionName",
        component: "sections",
        layout: "two-thirds",
        displayOrder: 1,
        children: [
          {
            type: "paragraph",
            displayOrder: 1,
            text: "test paragraph",
            apiDataId: ""
          }
        ]
      }
    }

    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Section {...testData} />
        </Router>
      </Provider>
    );

    const testParagraph = getByText("test paragraph")

    expect(testParagraph).toBeInTheDocument();
  });
});
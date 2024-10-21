import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import mockStore from "../../../core/store/mockStore";
import { RcLink } from "../RcLink";


describe("RcLink", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "linkName",
      text: "test link",
      children: []
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <Router>
          <RcLink {...testData} />
        </Router>
      </Provider>
    );
    
    const testLabel = getByText("test link")
    
    expect(testLabel).toBeInTheDocument();
  });
});
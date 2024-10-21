import React from "react";
import { render, screen } from "@testing-library/react";
import { RcLabel } from "../RcLabel";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import mockStore from "../../../core/store/mockStore";

describe("RcLabel", () => {
  it("renders with provided data", () => {

    const testData =  {
        "name": "beforeYouStartLabel",
        "type": "label",
        "size": "L",
        "text": "Before you start",
        "toolTip": "company",
        "displayOrder": 1,
        "children": [],
        "disabled": false,
        "visible": true
      };

    render(<Provider store={mockStore}>
        <Router>
            <RcLabel {...testData} />
        </Router>
    </Provider>);

    expect(screen.getByText("Before you start")).toBeInTheDocument();
  });
});
import React from "react";
import { render, screen } from "@testing-library/react";
import { RcCheckBoxGroup } from "../RcCheckBoxGroup";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import mockStore from "../../../core/store/mockStore";
import { BrowserRouter as Router } from "react-router-dom";

describe("RcCheckBoxGroup", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "selectAtmpCheckbox",
      type: "checkboxes",
      text: "",
      value: "select",
      checked: false,
      toolTip: "Select all the types that apply",
      displayOrder: 8,
      disabled: false,
      visible: true,
      events: [
        {
          event: "onClick",
          eventHandler: "handleChange",
        },
      ],
      options: [
        {
          title: "Recombinant protein",
          value: "recombinant",
        },
        {
          title: "Urine derived medicinal product",
          value: "urineDerived",
        },
        {
          title: "Vaccine",
          value: "vaccine",
        },
      ],
    };

    render(<Provider store={mockStore}>
        <Router>
            <RcCheckBoxGroup {...testData} />
        </Router>
    </Provider>);

    expect(screen.getByText("Recombinant protein")).toBeInTheDocument();
    expect(
      screen.getByText("Urine derived medicinal product")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select all the types that apply")
    ).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { RcRadioGroup } from "../RcRadioGroup";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import mockStore from "../../../core/store/mockStore";
import { BrowserRouter as Router } from "react-router-dom";

describe("RcRadioGroup", () => {
  it("renders with provided data", () => {
    const testData = {
        "name": "selectAppTypeRadio",
        "type": "radios",
        "text": "What type of application are you making?",
        "toolTip": "Select one.",
        "errorMessage": "Error: Please select one option to proceed.",
        "displayOrder": 2,
        "children": [],
        "disabled": false,
        "visible": true,
        "events": [
          {
            "event": "onChange",
            "eventHandler": "handleChange"
          }
        ],
        "options": [
          {
            "title": "Biological",
            "value": "biological"
          },
          {
            "title": "Chemical",
            "value": "chemical"
          },
          {
            "title": "Herbal",
            "value": "herbal"
          },
          {
            "title": "Homeopathic National Rules (NR)",
            "value": "homeoNat"
          },
          {
            "title": "Radiopharmaceutical",
            "value": "radioPharmaceutical"
          },
          {
            "title": "Simplified Homeopathic Registration (HR)",
            "value": "homeoHR"
          },
          {
            "title": "Traditional Herbal Registration (THR)",
            "value": "traditionalHerbal"
          }
        ]
    };

    render(<Provider store={mockStore}>
        <Router>
            <RcRadioGroup {...testData} />
        </Router>
    </Provider>);

    expect(screen.getByText("What type of application are you making?")).toBeInTheDocument();
    expect(screen.getByText("Herbal")).toBeInTheDocument();
    expect(screen.getByText("Select one.")).toBeInTheDocument();
  });
});

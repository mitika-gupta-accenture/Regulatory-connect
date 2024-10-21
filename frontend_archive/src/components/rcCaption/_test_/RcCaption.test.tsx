import React from "react";
import { render, screen } from "@testing-library/react";
import { RcCaption } from "../RcCaption";
import "@testing-library/jest-dom";

describe("RcCaption", () => {
  it("renders with provided data", () => {

    const testData = {
        "name": "licenseApplicationLabelCaption",
        "type": "caption",
        "text": "Tailor your application",
        "size": "L",
        "toolTip": "tooltip info",
        "displayOrder": 1,
        "children": [],
        "disabled": false,
        "visible": true
      };

    render(<RcCaption {...testData} />);

    expect(screen.getByText("Tailor your application")).toBeInTheDocument();
  });
  it("renders with provided data, add apiDataId and remove size attribute", () => {
    const testData = {
        "name": "licenseApplicationLabelCaption",
        "type": "caption",
        "text": "Tailor your application",
        "toolTip": "tooltip info",
        "displayOrder": 1,
        "children": [],
        "disabled": false,
        "visible": true,
        "className":"test",
        "apiDataId":"test"
      };
    render(<RcCaption {...testData} />);
    expect(screen.getByText("Tailor your application")).toBeInTheDocument();
  });
  it("renders with provided data, apiDataId amd text value with null value", () => {

    const testData = {
        "name": "licenseApplicationLabelCaption",
        "type": "caption",
        "text": "",
        "toolTip": "tooltip info",
        "displayOrder": 1,
        "children": [],
        "disabled": false,
        "visible": true,
        "className":"test",
        "apiDataId":""
      };

      const { container } = render(<RcCaption {...testData} />);
    expect(container.firstChild).toBeNull();
    
  });
});
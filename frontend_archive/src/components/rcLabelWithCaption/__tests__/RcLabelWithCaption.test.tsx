import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RcLabelWithCaption } from "../RcLabelWithCaption";

describe("RcLabelWithCaption", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "labelName",
      text: "test label",
      toolTip: "test tooltip"
    };

    const { getByText } = render(<RcLabelWithCaption {...testData} />);

    const testLabel = getByText("test label")
    const testTooltip =getByText("test tooltip")

    expect(testLabel).toBeInTheDocument();
    expect(testTooltip).toBeInTheDocument();
  });
  it("renders with provided data", () => {
    const testData = {      
      text: "",
      size:"M"
    };
    const { container } = render(<RcLabelWithCaption {...testData} />);
    expect(container.firstChild).toBeNull();
    
  });
  it("renders with provided data", () => {
    const testData = {
      name: "name",
      text: "test",
      toolTip: "",
      className:"testclass",
      size:"M"
    };

    const { getByText } = render(<RcLabelWithCaption {...testData} />);
    const testTooltip =getByText("test")
    expect(testTooltip).toBeInTheDocument();
  });
});
import React from "react";
import { render } from "@testing-library/react";
 
import { RcPanel } from "../RcPanel";
 
describe("RcPanel component", () => {
  it("renders without crashing", () => {
    render(<RcPanel text="Test Panel" />);
  });
 
  it("renders panel text correctly", () => {
    const { getByText } = render(<RcPanel text="Test Panel" />);
    expect(getByText("Test Panel")).toBeInTheDocument();
  });
 
  it("renders children elements correctly", () => {
    const testChildren = [
      { displayOrder: 1, type: "text", value: "Child 1" },
      { displayOrder: 2, type: "text", value: "Child 2" },
    ];
 
    const { getByText } = render(
      <RcPanel text="Test Panel" children={testChildren} />
    );
 
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });
 
  it("does not render children when children prop is not provided", () => {
    const { queryByText } = render(<RcPanel text="Test Panel" />);
    expect(queryByText("Child 1")).toBeNull();
    expect(queryByText("Child 2")).toBeNull();
  });
});
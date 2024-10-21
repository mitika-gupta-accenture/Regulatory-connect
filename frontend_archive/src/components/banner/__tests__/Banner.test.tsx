import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Banner } from "../Banner";

describe("PhaseBanner", () => {
  it("should render the component with the correct text", () => {
    render(<Banner />);
    const phaseBannerText = screen.getByText(/This is a new service/);
    expect(phaseBannerText).toBeInTheDocument();
    expect(phaseBannerText).toHaveClass("govuk-phase-banner__text");
  });

  it("should have the 'alpha' tag", () => {
    render(<Banner />);
    const alphaTag = screen.getByText("Alpha");
    expect(alphaTag).toBeInTheDocument();
  });
});
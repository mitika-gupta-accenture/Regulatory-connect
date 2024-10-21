import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { GridRow } from "../GridRow";

describe("GridRow component", () => {
  it("renders GridRow and renders children", () => {
    const { getByText, container } = render(
           
           <GridRow>
             <p>test paragraph</p>
            </GridRow>

    );

    const testParagraph = getByText("test paragraph");
    expect(testParagraph).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("govuk-grid-row")
  });
});
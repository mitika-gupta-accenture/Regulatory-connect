import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { GridCol } from "../GridCol";

describe("GridCol component", () => {
  it("renders GridCol with children", () => {
    const { container } = render(
                <GridCol className="test-class">
                    <p>test paragraph</p>
                </GridCol>

    );

    const childElement = container.querySelector('p');
    expect(childElement).toBeInTheDocument();
    expect(childElement?.textContent).toBe('test paragraph');
  });

  it('renders with correct className', () => {
    const className = 'test-class';
    const { container } = render(<GridCol className={className} />);
    const gridColElement = container.firstChild;
   expect(gridColElement).toHaveClass(`govuk-grid-column-${className}`);
  });
});
import React from "react";
import { render } from "@testing-library/react";
import { RcInsetText } from "../RcInsetText";

import "@testing-library/jest-dom";


describe("RcInsetText", () => {
  it("renders with provided data", () => {
    const testData = {
      name: "insetTextMessage",
      type: "inset",
      text: "Test Inset text",
      toolTip: "",
      displayOrder: 7,
      children: [],
      disabled: false,
      visible: true,
      apiDataId: "changeCompanyInput",
    };

    jest.mock('../../../core/hooks/useStringModifier', () => ({
      useStringModifier: () => ({
        getFinalString: jest.fn().mockReturnValue('Test Inset text'),
      }),
    }));

    const { getByText } = render( <RcInsetText {...testData} />);

    const testInsetText = getByText("Test Inset text")

    expect(testInsetText).toBeInTheDocument();
  });

  it('renders child buttons correctly', () => {
    const text = 'Example text';
    const apiDataId = 'example-id';
    const children = [
      { buttonText: 'Button 1', onClick: jest.fn(),  displayOrder: 7 },
      { buttonText: 'Button 2', onClick: jest.fn(),  displayOrder: 7 }
    ];

    const { getByText } = render(
      <RcInsetText text={text} apiDataId={apiDataId} children={children} />
    );

    children.forEach(({ buttonText }) => {
      expect(getByText(buttonText)).toBeInTheDocument();
    });
  });
});
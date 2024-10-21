import React from "react";
import { render } from "@testing-library/react";

import { RcHintText } from "../RcHintText";
import "@testing-library/jest-dom";


describe("RcHintText", () => {
  it('renders provided data & passes classNaame prop correctly', () => {
    const { getByText, container } = render(<RcHintText text="Test Hint Text" className="test-class" />);
    const testHintText = getByText("Test Hint Text");
    expect(testHintText).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('does not render when text is empty', () => {
    const { container } = render(<RcHintText text="" />);
    expect(container.firstChild).toBeNull();
  });
  
  it('renders HintText with final string if final string is not empty', () => {
    const props = {
      text: 'Test hint text',
      apiDataId: '123',
      className: 'test-class',
    };

    jest.mock('../../../core/hooks/useStringModifier', () => ({
      useStringModifier: () => ({
        getFinalString: jest.fn().mockReturnValue('Test hint text'),
      }),
    }));

    const { getByText } = render(<RcHintText {...props} />);
    expect(getByText('Test hint text')).toBeInTheDocument();
  });

});

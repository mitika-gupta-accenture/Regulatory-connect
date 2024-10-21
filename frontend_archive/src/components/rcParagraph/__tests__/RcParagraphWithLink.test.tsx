import { RcParagraphWithLink } from "../RcParagraphWithLink";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import * as Redux from "react-redux";
import { fireEvent } from '@testing-library/react';

import { mockFormData, mockFormFieldsData } from "../../../core/store/mockState";
import React from "react";
import { render } from "@testing-library/react";



jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));


jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage:  jest.fn(),
    previousPage: jest.fn(),
  })
}));

beforeEach(() => {
  (Redux.useSelector as unknown as jest.Mock)

    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);

});
describe('RcParagraphWithLink', () => {
  it('renders text before and after the link correctly', () => {
    const mockText = 'This is [a link] to somewhere.';
    
   
    const { getByText } = render(<RcParagraphWithLink text={mockText} />);
    
    
    expect(getByText(/This is/)).toBeInTheDocument();
    expect(getByText(/to somewhere\./)).toBeInTheDocument();
    
    const linkElement = getByText("a link");
    fireEvent.click(linkElement);

    
  });
  
  test("renders link with correct apiDataId", () => {
    const mockApiDataId = "mockApiDataId";
    const mockText = "This is a [link].";
    const { queryByRole } = render(
      <RcParagraphWithLink text={mockText} apiDataId={mockApiDataId} />
    );
  
    const linkElement = queryByRole("link");
  
  });


  it('passes disabled prop correctly', () => {
    
    const mockText = 'This is [a link] to somewhere.';
    const mockDisabled = true;

    
    const { getByText } = render(<RcParagraphWithLink text={mockText} disabled={mockDisabled} />);
    
    
    expect(getByText(/a link/)).toBeInTheDocument();
  });
  it('passes styleBlue prop correctly', () => {
    
    const mockText = 'This is [a link] to somewhere.';
    const mockStyleBlue = false;

    
    const { getByText } = render(<RcParagraphWithLink text={mockText} styleBlue={mockStyleBlue} />);
    
    
    const linkElement = getByText(/a link/);
    expect(linkElement).not.toHaveClass('blue'); 
  });
  it('passes visibilityCondition prop correctly', () => {
    
    const mockText = 'This is [a link] to somewhere.';
    const mockVisibilityCondition: any[] = []; 

    
    const { getByText } = render(<RcParagraphWithLink text={mockText} visibilityCondition={mockVisibilityCondition} />);
    
    
    expect(getByText(/a link/)).toBeInTheDocument();
  });
  it('passes className prop correctly', () => {
    const mockText = 'This is [a link] to somewhere.';
    const mockClassName = 'test-class';
  
    
    const { getByText } = render(<RcParagraphWithLink text={mockText} className={mockClassName} />);
    
    
    const linkElement = getByText(/a link/);
    expect(linkElement).toHaveClass(mockClassName);
  });
  

  
  
  
  it('renders the link with correct text', () => {
    const mockText = 'This is [a link] to somewhere.';
    
  
    const { getByText } = render(<RcParagraphWithLink text={mockText} />);
    
    
    expect(getByText('a link')).toBeInTheDocument();
  });

});
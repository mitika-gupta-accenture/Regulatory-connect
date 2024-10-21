import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Page } from "../Page";
import { useDispatch, useSelector } from "react-redux";
import { mockFormData, mockFormFieldsData, mockState } from "../../../core/store/mockState";
import { formDataSelector } from "../../../core/hooks/customSelectors";


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
    (useSelector as unknown as jest.Mock)
      .mockReturnValue({})
      .mockReturnValueOnce(mockFormData)
      .mockReturnValueOnce(mockFormFieldsData);
  });

describe("Page component", () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
    const sections = { 
        name: "test",
        sections: [{
            name: 'test section',
            component: 'sections',
            displayOrder: 1,
            children: [{
                name: 'button',
                type: 'button',
                component: 'button',
                text: 'testButton',
                displayOrder: 2,
            }]
        },{
            name: 'test section',
            component: 'sections',
            displayOrder: 1,
            children: [{
                name: 'button',
                type: 'button',
                component: 'button',
                text: 'testButton2',
                displayOrder: 1,
            }]
        }],
        events:[{event:"onLoad",eventHandler:""}],
        showSubmitButton: true,
    }
    
  it("renders page with header, banner, back-link and footer", () => {

    const { container, getByText } = render(<Page page={sections} pageIndex={1}/>);

    const Header = container.querySelector('header')
    const Footer = container.querySelector('footer')
    const Banner = getByText('Alpha')
    const BackLink = getByText('Back')
    expect(Header).toBeInTheDocument()
    expect(Footer).toBeInTheDocument()
    expect(Banner).toHaveClass('govuk-tag govuk-phase-banner__content__tag')
    expect(BackLink).toHaveClass('govuk-back-link')
  });

  it("renders no backlink when pageIndex is zero", () => {
    const sections = { 
        name: "test",
        sections: [{
            name: 'test section',
            component: 'sections',
            displayOrder: 1,
            children: [{
                name: 'button',
                type: 'button',
                component: 'button',
                text: 'testButton',
                displayOrder: 2,
            }]
        },{
            name: 'test section',
            component: 'sections',
            displayOrder: 1,
            children: [{
                name: 'button',
                type: 'button',
                component: 'button',
                text: 'testButton2',
                displayOrder: 1,
            }]
        }],
        events:[{event:"onLoad",eventHandler:""}],
        showSubmitButton: true,
        showCancelButton:true
    }
    const { queryByText } = render( <Page page={sections} pageIndex={-1}/>);
    const Backlink = queryByText('Back')
    expect(Backlink).toBeNull();
    expect(queryByText('Continue')).toBeInTheDocument();
  })

  it("renders page with button component", () => {

    const { getByText } = render(<Page page={sections} pageIndex={1}/>);

    const testButton = getByText('testButton')
    expect(testButton).toBeInTheDocument()
  });

  
});
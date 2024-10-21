import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch , useSelector} from "react-redux";
import { IRCDetailsProps, RcDetails } from "../RcDetails";
import { mockFormData, mockFormFieldsData, mockState } from "../../../core/store/mockState";
import { formDataSelector } from "../../../core/hooks/customSelectors";

// Mocking useDispatch

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

describe("RcDetails component", () => {
  it("renders details with expected text", () => {
    const field = {
        name: "details",
        displayOrder: 1,
        detailsText: 'test',
       
    }
    const { getByText } = render(<RcDetails {...(field as IRCDetailsProps)} />);

    const details = getByText("test");
    expect(details).toBeInTheDocument()
  });
  it("renders details with children", () => {
    const field = {
        name: "details",
        displayOrder: 1,
        detailsText: 'detail text test',
        type : "hintlabel",
        text : "test",
        toolTip : "test",
        disabled : false,
        visible : true,
        size : "M",
        events : [],
        value : "test",
        style : {},
        children : [],
        className : "test",
        summary : "test",
        open : false,
       
    }
    const { getByText } = render(<RcDetails {...(field as IRCDetailsProps)} />);

    const details = getByText("detail text test");
    expect(details).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    
    const childrenData = [
      {
        displayOrder: 1,
        type:"hintlabel",
        text:"child1"
      },
      {
        displayOrder: 2,
        type:"hintlabel",
        text:"child2"
      },
      // Add more child data as needed for testing different scenarios
    ];
    const field = {
      name: "details",
      displayOrder: 1,
      detailsText: 'detail text test',
      type : "hintlabel",
      text : "test",
      toolTip : "test",
      disabled : false,
      visible : true,
      size : "M",
      events : [],
      value : "test",
      style : {},
      children : childrenData,
      className : "test",
      summary : "test",
      open : true,
     
  }
  const mockDispatch = jest.fn();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
    const { getByText } = render(<RcDetails  {...field} />);
    // Check if each child element is rendered
    childrenData.forEach((child) => {
      const childText = getByText(child.text.toString());
      expect(childText).toBeInTheDocument();
    });    
  });
});
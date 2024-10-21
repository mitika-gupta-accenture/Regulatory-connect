import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { RcButtonGroup, IRcButtonGroupProps } from "../RcButtonGroup";
import { useSelector } from "react-redux";
import { mockFormData, mockFormFieldsData } from "../../../core/store/mockState";
import useEventHandlers from "../../../core/hooks/useEventHandlers";

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

jest.mock("../../../core/hooks/useEventHandlers", () => ({
  __esModule: true,
  default: jest.fn(),
}));


describe("RcButtonGroup Component", () => {

  (useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);

  const mockBindEventHandlers = jest.fn();
  (useEventHandlers as unknown as jest.Mock).mockReturnValue({ bindEventHandlers: mockBindEventHandlers });

  // Mock components
  const MockRcLabelWithCaption = jest.fn((props) => <div>{props.text}</div>);
  const MockRcButton = jest.fn((props) => <button>{props.children}</button>);

  jest.mock("../../rcLabelWithCaption/RcLabelWithCaption", () => ({
    RcLabelWithCaption: MockRcLabelWithCaption,
  }));

  jest.mock("../../rcButton/RcButton", () => ({
    RcButton: MockRcButton,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test cases
  it("renders correctly with visible true", () => {
    const props: IRcButtonGroupProps = {
      children: [{ apiDataId: "1", visible: true }],
      visible: true,
      text: "Button Group Text",
    };
    const { getByText } = render(
      <RcButtonGroup {...props} />
    );
    expect(getByText("Button Group Text")).toBeInTheDocument();

  });


  it("renders correctly no visible", () => {
    const props: IRcButtonGroupProps = {
      children: [{ apiDataId: "1", visible: true }],
      text: "Button Group Text",
    };
    const { getByText } = render(
      <RcButtonGroup {...props} />
    );
    expect(getByText("Button Group Text")).toBeInTheDocument();
    
  });


  it("renders correctly with visible false", () => {
    const props: IRcButtonGroupProps = {
      children: [{ apiDataId: "1", visible: true }],
      visible: false,
      text: "Button Group Text",
    };
    const { container } = render(
      <RcButtonGroup {...props} />
    );
    expect(container.firstChild).toBeNull();
    expect(MockRcButton).not.toHaveBeenCalled();
  });
});




import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch, useSelector } from "react-redux";
import { mockFormData, mockFormFieldsData, mockState } from "../../../core/store/mockState";
import { RcInput } from "../RcInput";
import { formDataSelector, formErrDataSelector } from "../../../core/hooks/customSelectors";

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation(selector => selector()),
}));

jest.mock("../../../core/hooks/useNavigation", () => ({
  __esModule: true,
  default: () => ({
    nextPage: jest.fn(),
    previousPage: jest.fn(),
  })
}));

beforeEach(() => {
  (useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);
});


describe("RcInput component", () => {
  const mockDispatch = jest.fn();
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock)
    .mockReturnValueOnce(formDataSelector(mockState))
    .mockReturnValueOnce(formErrDataSelector(mockState));
  it("renders input with expected text", () => {

    const { getByText } = render(<RcInput text="Input text" name="territory" />);

    const details = getByText("Input text");
    expect(details).toBeInTheDocument();
  });

  it("renders input with default props", () => {

    const { getByDisplayValue } = render( <RcInput text="Input text" name="inputName" value="checkRcInputText" disabled={false} events={[{ event: 'onChange', eventHandler: "handleChange" }]}  errorMessage = "This is required" required = {true} />);

    const details = getByDisplayValue("checkRcInputText");
    expect(details).toBeInTheDocument()
  });
});
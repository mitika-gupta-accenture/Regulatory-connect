import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // For extended matchers
import { RcDateField, RcDateFieldProps } from "../RcDateField";
import { useDispatch, useSelector } from "react-redux";
import { mockFormData, mockFormFieldsData, mockState } from "../../../core/store/mockState";
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

describe("RcDateField Component", () => {
  const defaultProps: RcDateFieldProps = {
    text: "Date",
    name: "date",
    hintText: "Enter date",
    inputNames: [{
      day: "1",
      month: "1",
      year: "1999",
    }],
    inputs: {
      day: { autoComplete: "off" },
      month: { autoComplete: "off" },
      year: { autoComplete: "off" },
    },
  };
  const mockDispatch = jest.fn();
  const mockFromErrData = {
    applicationFormReducer: {
      applicationFormData: {
        territory: ["My User Territory"],
        date: { day: "1", month: "12", year: "1996" }
      },
      applicationFormFieldError: {
        formFieldErrors: { test: "please remove", date: "Please enter Day, Month, Year" },
        showErrors: true
      },
      applicationFormTitleData: { territory: ["My User Territory"] }
    }
  };
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as unknown as jest.Mock)
    .mockReturnValueOnce(formDataSelector(mockState))
    .mockReturnValueOnce(formErrDataSelector(mockFromErrData));
  it("renders with default props", () => {
    const { getByText } = render(<RcDateField {...defaultProps} />);

    expect(getByText("Date")).toBeInTheDocument();
    expect(getByText("Enter date")).toBeInTheDocument();
  });

  it("triggers onChange event with correct date object", () => {
    const formErrData = { formFieldErrors: { date: "please enter day, month, year" }, showErrors: true };
    // (useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState));
    (useSelector as unknown as jest.Mock).mockReturnValue(formErrData);
    const RcDateProps: RcDateFieldProps = {
      text: "Date",
      name: "date",
      errorMessage: "Invalid date",
      input: { value: { day: "1", year: "2024", month: "11" } },
      inputNames: [{
        day: "day",
        month: "month",
        year: "year",
      }],
      inputs: {
        day: { autoComplete: "off" },
        month: { autoComplete: "off" },
        year: { autoComplete: "off" },
      },
    };
    const handleChange = jest.fn();
    const { getByLabelText, getByRole } = render(
      <RcDateField {...RcDateProps} input={{ onChange: handleChange }} />
    );

    fireEvent.change(getByLabelText("Day"), { target: { value: "25", name: "day" } });
    expect(handleChange).toHaveBeenCalledWith({
      day: "25"
    });
    const dayInput = getByRole("spinbutton", { name: "Day" });
    expect(dayInput).toHaveAttribute("value", "25");
    fireEvent.change(getByLabelText("Month"), { target: { value: "04", name: "month" } });

    expect(getByRole("spinbutton", { name: "Month" })).toHaveAttribute("value", "04");
    expect(handleChange).toHaveBeenCalledWith({
      month: "04"
    });
    fireEvent.change(getByLabelText("Year"), { target: { value: "2024", name: "year" } });
    expect(getByRole("spinbutton", { name: "Year" })).toHaveAttribute("value", "2024");
    expect(handleChange).toHaveBeenCalledWith({
      year: "2024"
    });
    expect(handleChange).toHaveBeenCalledTimes(3);
  });
});

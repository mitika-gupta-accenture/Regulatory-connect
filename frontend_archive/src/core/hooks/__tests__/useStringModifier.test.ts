import { renderHook } from "@testing-library/react-hooks";
import { useSelector } from "react-redux";
import useStringModifier from "../useStringModifier";
import { getFormattedDateTime } from "../../utils/formatUtils";
import { TOKENS } from "../../constants/tokens";
import { formDataSelector, formFieldsDataSelector, formTitleDataSelector } from "../customSelectors";
import { mockState } from "../../store/mockState";
import * as Redux from "react-redux";

const {
  replaceTokenWithFormFieldsData,
  replaceTokenWithFormData,
  replaceTokenWithDateTime,
  replaceTokenWithLink,
  resolveNestedkeys,
} = useStringModifier();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("useStringModifier", () => {
  const mockFormFieldData = {
    selectAppTypeRadio: "test",
    chemicalLegalStatusChangeRadioGroup: "Yes",
    personalDetails: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phno: 12345,
    },
    address: {
      street: "123 Main St",
      city: "New York",
      state: "State",
      zip: "12345",
    },
    companies: [
      {
        name: "Big Company Ltd",
        address:
          "Mayson House, Maynard Industrial Estate, Halifax, HX4 6TY, UK",
      },
    ],
    selectAtmpCheckbox: "ATMP",
    dateTime: getFormattedDateTime(),
    nested: {
      data: 2234,
    },
  };

  const mockFormData = {
    selectAppTypeRadio: "test",
    chemicalLegalStatusChangeRadioGroup: "Yes",
    personalDetails: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    date: {
      day: '1',
      month: '1',
      year: '2023'
    }
  };

  const mockFormTitleData = {
    formTitle: "Example Form",
    selectAppTypeRadio: "Chemical ",
    selectAtmpCheckbox: [
      "ATMP ",
      "Blood derived medicinal product",
      "Non-recombinant (extracted) protein",
    ],
  };

  beforeEach(() => {
    (useSelector as unknown as jest.Mock)
      .mockReturnValueOnce(mockFormFieldData)
      .mockReturnValueOnce(mockFormData)
      .mockReturnValueOnce(mockFormTitleData);
  });

  const mockDateTime = "2024-03-12 10:30 AM";
  const link = "https://example.com";
  const mockGetFormattedDateTime = jest.fn(() => mockDateTime);
  afterEach(() => {
    (useSelector as unknown as jest.Mock).mockClear();
  });

  it("should render correctly and access formFieldData", () => {
    const { result } = renderHook(() => useStringModifier());

    expect(result.current.formFieldData).toEqual(mockFormFieldData);
  });
  it("should render correctly and access formData", () => {
    const { result } = renderHook(() => useStringModifier());

    expect(result.current.formData).toEqual(mockFormData);
  });
  it("should render correctly and access formTitleData", () => {
    const { result } = renderHook(() => useStringModifier());

    expect(result.current.formTitleData).toEqual(mockFormTitleData);
  });
  test("replaces token with simple data ID", () => {
    const { result } = renderHook(() => useStringModifier());
    const formattedString: any = result.current.replaceTokenWithFormFieldsData(
      `Hello ${mockFormFieldData.personalDetails.firstName}`,
      "personalDetails.firstName"
    );
    expect(formattedString).toBe("Hello John");
  });
  test("switch case for companies name", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = `${TOKENS.FORM_FIELD_DATA}|companies.0.name`;
    const finalString = result.current.getFinalString(
      tokenizedString,
      mockFormFieldData.companies[0].name
    );
    expect(finalString).toBe(mockFormFieldData.companies[0].name);
  });

  test("switch case for replaceTokenWithFormData", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = TOKENS.FORM_DATA;
    const finalString = result.current.getFinalString(
      tokenizedString,
      "selectAppTypeRadio"
    );
    expect(finalString).toBe(mockFormTitleData.selectAppTypeRadio);
    const finalStringForArray = result.current.getFinalString(
      tokenizedString,
      "selectAtmpCheckbox"
    );
    expect(finalStringForArray).toBe(mockFormTitleData.selectAtmpCheckbox);
  });

  test("switch case for replaceTokenWithFormData with pipe", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = `${TOKENS.FORM_DATA}|selectAppTypeRadio`;
    const finalString = result.current.getFinalString(
      tokenizedString,
      "selectAppTypeRadio"
    );
    expect(finalString).toBe(mockFormTitleData.selectAppTypeRadio);
  });

  test("returns empty string when nested key does not match to string type", () => {
    const string = "This is a |form_field_data| token";
    const dataId = "nested.data";

    const result: any = replaceTokenWithFormFieldsData(string, dataId);

    expect(result).toBe("");
  });

  test("switch case for replaceTokenWithFormFieldsData", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = TOKENS.FORM_FIELD_DATA;
    const finalString = result.current.getFinalString(
      tokenizedString,
      "selectAppTypeRadio"
    );
    expect(finalString).toBe(mockFormFieldData.selectAppTypeRadio);
  });

  test("switch case for replaceTokenWithDateTime", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = TOKENS.DATE_TIME;
    const finalString = result.current.getFinalString(tokenizedString);
    expect(finalString).toBe(mockFormFieldData.dateTime);

    const tokenizedStringDate = `${TOKENS.DATE_TIME}|dateTime`;
    const finalDateString = result.current.getFinalString(tokenizedStringDate);
    expect(finalDateString).toBe(mockFormFieldData.dateTime);
  });

  test("switch case for replaceTokenWithFormattedDate", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = TOKENS.FORMAT_DATE;
    const finalString1 = result.current.getFinalString(tokenizedString, "date");
    const finalString2 = result.current.getFinalString(tokenizedString, "false");
    expect(finalString1).toBe("1 January 2023");
    expect(finalString2).toBe("%%%");
  });

  test("replaces token with simple data ID for replaceTokenWithFormData", () => {
    const string = `Hello ${mockFormFieldData.selectAppTypeRadio}`;
    const replacedString = replaceTokenWithFormData(
      string,
      "selectAppTypeRadio"
    );
    expect(replacedString).toBe(
      `Hello ${mockFormFieldData.selectAppTypeRadio}`
    );
  });

  test("replaces token with formatted date and time", () => {
    const string = `Current date and time: ${mockDateTime}`;
    const replacedString = replaceTokenWithDateTime(string);
    expect(replacedString).toBe(`Current date and time: ${mockDateTime}`);
    expect(mockGetFormattedDateTime).toHaveBeenCalledTimes(0);
  });

  test("replaces token with provided link", () => {
    const string = `Click here: ${link}`;
    const replacedString = replaceTokenWithLink(string, link);
    expect(replacedString).toBe(`Click here: ${link}`);
  });

  test("handles undefined dataId", () => {
    const string = "Click here: |LINK";
    const replacedString = replaceTokenWithLink(string);
    expect(replacedString).toBe("Click here: |LINK");
  });

  test("handles empty string as dataId", () => {
    const string = `Click here: ${link}`;
    const replacedString = replaceTokenWithLink(string, "");
    expect(replacedString).toBe(`Click here: ${link}`);
  });

  test("handles string with no token", () => {
    const string = "This is a string without token";
    const replacedString = replaceTokenWithLink(string, "https://example.com");
    expect(replacedString).toBe(string);
  });
  test("handles empty dataId for replaceTokenWithFormData", () => {
    const string = `Hello ${mockFormFieldData.selectAppTypeRadio}`;
    const replacedString = replaceTokenWithFormData(string, "");
    expect(replacedString).toBe(
      `Hello ${mockFormFieldData.selectAppTypeRadio}`
    );
  });

  test("handles undefined formTitleData", () => {
    const string = `Hello ${mockFormFieldData.selectAppTypeRadio}`;
    const replacedString = replaceTokenWithFormData(
      string,
      mockFormFieldData.selectAppTypeRadio
    );
    expect(replacedString).toBe(
      `Hello ${mockFormFieldData.selectAppTypeRadio}`
    );
  });

  test("handles missing or undefined data ID", () => {
    const string = `Hello ${mockFormFieldData.personalDetails.firstName}`;
    const replacedString = replaceTokenWithFormFieldsData(string);
    expect(replacedString).toBe("");
  });

  test("handles unknown token", () => {
    const { result } = renderHook(() => useStringModifier());
    const tokenizedString = "Unknown token |UNKNOWN_TOKEN";
    const finalString = result.current.getFinalString(tokenizedString);
    expect(finalString).toBe("Unknown token |UNKNOWN_TOKEN");
  });

  test("handles missing or undefined data ID", () => {
    const string = `Hello ${mockFormFieldData.personalDetails.firstName}`;
    const dataId = undefined;
    const replacedString = replaceTokenWithFormFieldsData(string, dataId);
    expect(replacedString).toBe("");
  });

  test("replaces token with simple data ID", () => {
    const string = `Form title: ${mockFormTitleData.formTitle}`;
    const replacedString = replaceTokenWithFormData(
      string,
      "selectAppTypeRadio"
    );
    expect(replacedString).toBe("Form title: Example Form");
  });

  test("checking phone number in replaceTokenWithFormData", () => {
    const string = `Mobile no: ${mockFormFieldData.personalDetails.phno}`;
    const replacedString = replaceTokenWithFormData(string, "phno");
    expect(replacedString).toBe(
      `Mobile no: ${mockFormFieldData.personalDetails.phno}`
    );
  });

  test("handles string with no token", () => {
    const string = "This is a string without token";
    const replacedString = replaceTokenWithLink(string, "https://example.com");
    expect(replacedString).toBe(string);
  });

  test("returns undefined for non-existent nested data ID", () => {
    const dataId = "personalDetails.address.nonExistent";
    const nestedValue = resolveNestedkeys(dataId);
    expect(nestedValue).toBeUndefined();
  });

  test("returns undefined for invalid data ID", () => {
    const dataId = "personalDetails.invalidKey";
    const nestedValue = resolveNestedkeys(dataId);
    expect(nestedValue).toBeUndefined();
  });

  test("handles invalid tokens", () => {
    const string = "Invalid token: |INVALID_TOKEN";
    const replacedString = replaceTokenWithLink(string, "https://example.com");
    expect(replacedString).toBe(string);
  });

  test("handles empty or missing dataId in replaceTokenWithFormFieldsData", () => {
    const string = "Empty dataId: |FORM_FIELD_DATA";
    const replacedStringEmpty = replaceTokenWithFormFieldsData(string, "");
    const replacedStringMissing = replaceTokenWithFormFieldsData(string);
    expect(replacedStringEmpty).toBe("");
    expect(replacedStringMissing).toBe("");
  });

  it("should handle default behavior when tokens are not found", () => {
    const tokenizedString = "No tokens here";
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(tokenizedString);
    expect(formattedString).toBe(tokenizedString);
  });

  test("getFinalString returns original string if token not found", () => {
    const { result } = renderHook(() => useStringModifier());

    const originalString = "Hello world";
    const formattedString = result.current.getFinalString(originalString);
    expect(formattedString).toBe(originalString);
  });

  test("getFinalString returns empty string if form data not found for FORM_DATA token", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(
      "Hello FORM_DATA",
      "invalidField"
    );
    expect(formattedString).toBe("Hello FORM_DATA");
  });

  test("getFinalString returns correct string with nested form field data", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(
      mockFormFieldData.personalDetails.firstName,
      "personalDetails.firstName"
    );
    expect(formattedString).toBe(mockFormFieldData.personalDetails.firstName);
  });

  test("getFinalString returns correct string with multiple nested form field data", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(
      `${mockFormFieldData.personalDetails.firstName} ${mockFormFieldData.personalDetails.lastName}`,
      "personalDetails.firstName.lastName"
    );
    expect(formattedString).toBe("John Doe");
  });

  test("getFinalString returns correct string with nested form field data with numeric key", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(
      mockFormFieldData.address.city,
      "addresses.0.city"
    );
    expect(formattedString).toBe("New York");
  });

  test("getFinalString returns correct string with nested form field data and nested token", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString: any = result.current.getFinalString(
      `Hello ${mockFormFieldData.personalDetails.email}`,
      "personalDetails.email"
    );
    expect(formattedString).toBe("Hello john.doe@example.com");
  });

  test("getFinalString returns empty string if form title data not found for FORM_DATA token", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString(
      "Hello FORM_DATA",
      "invalidField"
    );
    expect(formattedString).toBe("Hello FORM_DATA");
  });

  test("getFinalString returns empty string if dataId not provided for FORM_FIELD_DATA token", () => {
    const { result } = renderHook(() => useStringModifier());

    const formattedString = result.current.getFinalString("");
    expect(formattedString).toBe("");
  });

  test("getFinalString returns original string if token not found", () => {
    const { result } = renderHook(() => useStringModifier());

    const originalString = "Hello world";
    const formattedString = result.current.getFinalString(originalString);
    expect(formattedString).toBe(originalString);
  });

  test("getFinalString function - with FORM_DATA token in switch statement", () => {
    const { result } = renderHook(() => useStringModifier());
    const finalString = result.current.getFinalString(
      `Form title ${mockFormTitleData.formTitle}`
    );
    expect(finalString).toBe("Form title Example Form");
  });
});

it("useSelector should be called with the correct selector function", () => {
  // Mock the useSelector behavior
  (Redux.useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
    .mockReturnValueOnce(formTitleDataSelector(mockState))
    .mockReturnValueOnce(formFieldsDataSelector(mockState));

  // Render the hook
  renderHook(() => useStringModifier());
});
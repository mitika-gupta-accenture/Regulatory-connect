import { renderHook } from "@testing-library/react-hooks";
import { useSelector } from "react-redux";
import { useValidate } from "../useValidate";
import { MESSAGE_CONSTANTS } from "../../constants/messages";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

const triggerEventMock = jest.fn();

jest.mock("../useTriggerEvents", () => {
  return jest.fn().mockImplementation(() => ({
    triggerEvent: triggerEventMock,
  }));
});

describe("useValidate", () => {
  const mockFormFieldData = {
    addMore: [
      {
        "name": "textArea",
        "type": "textArea",
      }
    ],
    autoComplete: ['option 1', 'option 2'],
    invalidAutoComplete: ['option 1', 'option 2']
  }

  const mockFormData = {
    input: '1',
    invalidInput: '',
    date: {
      day: '1',
      month: '1',
      year: '2003'
    },
    invalidDate: {
      day: "1",
      month: "1",
      year: "1800"
    },
    textArea: 'aaa',
    invalidTextArea: '',
    autoComplete: 'option 2',
    invalidAutoComplete: 'option 1.5',
    checkboxes: ['option 1'],
    invalidCheckboxes: [],
    radios: 'option 1',
    invalidRadios: "",
    select: 'option 1',
    invalidSelect: '',
  }

  const mockFormFieldErrors = {
    input: 'error',
    date: 'error',
    textArea: 'error',
    autoComplete: 'error',
    checkboxes: 'error',
    radios: 'error',
    select: 'error'
  }

  beforeEach(() => {
    (useSelector as unknown as jest.Mock)
      .mockReturnValueOnce(mockFormData)
      .mockReturnValueOnce(mockFormFieldData)
      .mockReturnValueOnce(mockFormFieldErrors);
  });

  afterEach(() => {
    (useSelector as unknown as jest.Mock).mockClear();
  })

  describe("validateAllFields", () => {

    it("should validate a component if it is on the page and there is a valid value is in redux", () => {
      const { result } = renderHook(() => useValidate());
      document.body.innerHTML = '<div name="input"></div>'

      const validationCheck = result.current.validateAllFields([{
          "name": "input",
          "type": "input"
      }]);

      expect(validationCheck.includes(false)).toEqual(false);
    })

    it("should not validate a component if there is no value is in redux", () => {
      const { result } = renderHook(() => useValidate());
      document.body.innerHTML = '<div name="noComponent"></div>'

      const validationCheck = result.current.validateAllFields([{
          "name": "noComponent",
          "type": "input"
      }]);

      expect(validationCheck.includes(false)).toEqual(true);
    })

    it("should not validate a component if the component is not visible", () => {
      const { result } = renderHook(() => useValidate());
      document.body.innerHTML = '<div></div>'

      const validationCheck = result.current.validateAllFields([{
          "name": "input",
          "type": "input"
      }]);

      expect(validationCheck.includes(false)).toEqual(false);
    })

    it("should not validate the value in redux is invalid", () => {
      const { result } = renderHook(() => useValidate());
      document.body.innerHTML = '<div name="invalidInput"></div>'

      const validationCheck = result.current.validateAllFields([{
          "name": "invalidInput",
          "type": "input"
      }]);

      expect(validationCheck.includes(false)).toEqual(true);
    })

    it("should validate a dateField component", () => {
      const { result } = renderHook(() => useValidate());
      document.body.innerHTML = '<div name="MRPAuthorisationDateDay"></div>'

      const validationCheck = result.current.validateAllFields([{
        "name": "MRPAuthorisationDate",
        "type": "dateField",
        "inputNames": [
          {
            "month": "MRPAuthorisationDateMonth",
            "year": "MRPAuthorisationDateYear",
            "day": "MRPAuthorisationDateDay"
          }
        ]
      }]);

      expect(validationCheck.includes(false)).toEqual(false);
    })

    it("should validate an addMore component", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateAllFields([{
        "name": "addMore",
        "type": "AddMore",
        "children": [
          {
            "name": "textArea",
            "type": "textArea",
            "text": "Licence condition"
          }
        ]
      }]);

      expect(validationCheck.includes(false)).toEqual(false);
    })
  }) 

  describe("validateOneField", () => {
    it("should throw an error if the type is invalid", () => {
      const { result } = renderHook(() => useValidate());
      const type = 'invalid'

      expect(() => {result.current.validateOneField("ProcedureNumber", type)}).toThrow(Error);
      expect(() => {result.current.validateOneField("ProcedureNumber", type)}).toThrow(`'${type}' has no validation function`);
    })

    it("should validate an auto complete with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('autoComplete', 'autoComplete');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate an auto complete with a invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidAutoComplete', 'autoComplete');

      expect(validationCheck).toEqual(false);
    })

    it("should validate an auto complete with an valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('autoComplete', 'autoComplete', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'option 1');

      expect(validationCheck).toEqual(true);
    })

    it("should not validate an auto complete with a invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidAutoComplete', 'autoComplete', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'option 1.5');

      expect(validationCheck).toEqual(undefined);
    })

    it("should validate checkboxes with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('checkboxes', 'checkboxes');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate checkboxes with an invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidCheckboxes', 'checkboxes');

      expect(validationCheck).toEqual(false);
    })

    it("should validate checkboxes with a valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('checkboxes', 'checkboxes', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'option 1');

      expect(validationCheck).toEqual(true);
    })

    it("should not validate checkboxes with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('checkboxes', 'checkboxes', MESSAGE_CONSTANTS.REQUIRED_FIELD, '');

      expect(validationCheck).toEqual(undefined);
    })

    it("should validate a date with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('date', 'dateField');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate a date with an invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidDate', 'dateField');

      expect(validationCheck).toEqual(false);
    })

    it("should validate date with a valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck1 = result.current.validateDate('date', 'date', MESSAGE_CONSTANTS.REQUIRED_FIELD, { day: '1', month: '1', year: '2003' });
      const validationCheck2 = result.current.validateDate('date', 'date', MESSAGE_CONSTANTS.REQUIRED_FIELD, { day: '29', month: '2', year: '2024' });

      expect(validationCheck1).toEqual(true);
      expect(validationCheck2).toEqual(true);
    })

    it("should not validate date with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck1 = result.current.validateDate('date', 'date', MESSAGE_CONSTANTS.REQUIRED_FIELD, { day: '1', month: '1', year: '1800' });
      const validationCheck2 = result.current.validateDate('date', 'date', MESSAGE_CONSTANTS.REQUIRED_FIELD, { day: '29', month: '2', year: '2025' });

      expect(validationCheck1).toEqual(undefined);
      expect(validationCheck2).toEqual(undefined);
    })

    it("should validate an input with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('input', 'input');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate an input with an invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidInput', 'input');

      expect(validationCheck).toEqual(false);
    })

    it("should validate an input with a valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('input', 'input', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'aaa');

      expect(validationCheck).toEqual(true);
    })

    it("should not validate an input with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('input', 'input', MESSAGE_CONSTANTS.REQUIRED_FIELD, '');

      expect(validationCheck).toEqual(undefined);
    })

    it("should validate radios with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('radios', 'radios');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate radios with a invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidRadios', 'radios');

      expect(validationCheck).toEqual(false);
    })

    it("should validate radios with a valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('radios', 'radios', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'option 1');

      expect(validationCheck).toEqual(true);
    })

    it("should not validate radios with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('radios', 'radios', MESSAGE_CONSTANTS.REQUIRED_FIELD, '');

      expect(validationCheck).toEqual(undefined);
    })


    it("should validate a select with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('select', 'select');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate a select with an invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidSelect', 'select');

      expect(validationCheck).toEqual(false);
    })

    it("should validate a select with an valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('select', 'select', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'option 1');

      expect(validationCheck).toEqual(true);
    })

    it("should not validate a select with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('select', 'select', MESSAGE_CONSTANTS.REQUIRED_FIELD, '');

      expect(validationCheck).toEqual(undefined);
    })

    it("should validate a text area with a valid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('textArea', 'textArea');

      expect(validationCheck).toEqual(undefined);
    })

    it("should not validate a text area with an invalid redux value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('invalidTextArea', 'textArea');

      expect(validationCheck).toEqual(false);
    })

    it("should validate a text area with a valid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('textArea', 'textArea', MESSAGE_CONSTANTS.REQUIRED_FIELD, 'aaa');

      expect(validationCheck).toEqual(true);
    })

    it("should validate a text area with an invalid onChange value", () => {
      const { result } = renderHook(() => useValidate());

      const validationCheck = result.current.validateOneField('textArea', 'textArea', MESSAGE_CONSTANTS.REQUIRED_FIELD, '');

      expect(validationCheck).toEqual(undefined);
    })
  })
})
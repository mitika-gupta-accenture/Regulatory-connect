import useEventHandlers from "../useEventHandlers";
import { useSelectorMock } from "../../../../test-env-setup";
import { IChildrenJsonProps, IEventConfigJsonProps, INestedChildrenJsonProps } from "../../types/common";
import { act } from "@testing-library/react";
import { ChangeEvent } from "react";
import * as Redux from "react-redux";
import { formDataSelector, formErrDataSelector, formTitleDataSelector } from "../customSelectors";
import { mockState, mockFormData, mockFormFieldsData } from "../../store/mockState";
import useTriggerEvents from "../useTriggerEvents";
import { renderHook } from "@testing-library/react-hooks";

const triggerEventMock = jest.fn();

jest.mock("../useTriggerEvents", () => {
  return jest.fn().mockImplementation(() => ({
    triggerEvent: triggerEventMock,
  }));
});

beforeEach(() => {
  jest.resetAllMocks();
  (Redux.useSelector as unknown as jest.Mock)
    .mockReturnValue({})
    .mockReturnValueOnce(mockFormData)
    .mockReturnValueOnce(mockFormFieldsData);
});


beforeEach(() => {
  jest.resetAllMocks();
});

describe("[useEventHandlers]", () => {
  // arrange
  const fieldName = "territory";
  const formFieldErrorData = { formFieldErr: { territory: "My User Territory", } };
  useSelectorMock.mockReturnValue(formFieldErrorData);
  const {
    handleDeleteFieldData,
    handleClearErrorFieldData,
    bindEventHandlers,
  } = useEventHandlers();

  describe("handleDeleteFieldData", () => {
    it("calls 'triggerEvent' twice with the correct data", () => {
      //act
      const result = handleDeleteFieldData(fieldName);

      //assert
      expect(triggerEventMock).toHaveBeenCalledTimes(2);
      expect(triggerEventMock).toHaveBeenNthCalledWith(1, "deleteFormData", {
        name: fieldName,
        value: "",
        title: "",
      });
      expect(triggerEventMock).toHaveBeenNthCalledWith(2, "formFieldErr", {
        name: "formFieldErr",
        value: fieldName,
      });
      expect(result).toBe(undefined);
    });
  });

  describe("handleClearErrorFieldData", () => {
    //arrange
    const name = "territory";

    it("does not call triggerEvent", () => {
      //arrange
      const formErrorData = {};

      //act
      const result = handleClearErrorFieldData(name, formErrorData);

      //assert
      expect(triggerEventMock).toHaveBeenCalledTimes(0);
      expect(result).toBe(undefined);
    });

    it("does call triggerEvent", () => {
      //arrange
      const formErrorData = {
        formFieldErr: { [name]: "bar" },
      };

      //act
      const result = handleClearErrorFieldData(name, formErrorData);

      //assert
      expect(triggerEventMock).toHaveBeenCalledTimes(1);
      expect(triggerEventMock).toHaveBeenNthCalledWith(1, "formFieldErr", {
        name: "formFieldErr",
        value: name,
      });
      expect(result).toBe(undefined);
    });
  });

  describe("bindEventHandler", () => {
    afterEach(() => {
      useSelectorMock.mockClear(); // Clear mock usage information after each test
    });
    it("returns all bound event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onChange", eventHandler: "handleChange" },
        { event: "onLoad", eventHandler: "handleApiCall" },
      ];
      const customFunction = () => {
        return {};
      };
      const navigationCondition = "territory";
      const apiDataHandler = "bar";

      //act
      const result = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        apiDataHandler
      );

      //assert
      expect(result).toEqual({
        onChange: expect.any(Function),
        onLoad: expect.any(Function),
      });
    });

    it("returns an empty object if events is not an array", () => {
      //arrange
      const events = "" as unknown as IEventConfigJsonProps[]
      const customFunction = () => {
        return {};
      };
      const navigationCondition = "territory";
      const apiDataHandler = "bar";

      //act
      const result = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        apiDataHandler
      );

      //assert
      expect(result).toEqual({});
    });

    it("returns handleOnClick event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "click", eventHandler: "handleOnClick" },
        { event: "onLoad", eventHandler: "handleApiCall" },
      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text' } };
      };
      const navigationCondition = "territory";
      const apiDataHandler = "bar";
      // Assert

      const result = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        apiDataHandler
      );
      expect(result).toEqual({

        onLoad: expect.any(Function),
        click: expect.any(Function)
      });
      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { value: 'TestValue', type: 'text' } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['click'](mockEvent, customFunction, navigationCondition, apiDataHandler);
      });

    });
    it("returns clearSessionAndNavigate event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "click", eventHandler: "clearSessionAndNavigate" },
        { event: "onLoad", eventHandler: "handleApiCall" },
      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text' } };
      };
      const navigationCondition = "territory";
      const apiDataHandler = "bar";
      // Assert

      const result = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        apiDataHandler
      );

      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['click'](mockEvent, customFunction, navigationCondition);
      });

    });

    it("returns handleApiCall event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onLoad", eventHandler: "handleAPICall" },
      ];
      const customFunction = () => {
        return {};
      };

      const apiDataHandler = "bar";
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
        apiDataHandler
      );
      expect(result).toEqual({
        onLoad: expect.any(Function),
      });
      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { name: 'testName', value: 'testValue' } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onLoad'](mockEvent, customFunction, apiDataHandler);
      });


    });

    it("returns handleBlur event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "blur", eventHandler: "handleBlur" },
        { event: "onLoad", eventHandler: "handleApiCall" },
      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text' } };
      };
      // Assert

      const result = bindEventHandlers(
        events,
        customFunction,
      );

      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['blur'](mockEvent, customFunction);
      });

    });

    it("returns handleChange event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onChange", eventHandler: "handleChange" },

      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text' } };
      };
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
      );

      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { value: 'TestValue', type: 'text', name: "test" } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onChange'](mockEvent, customFunction);
      });
      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { value: 'TestValue', type: 'checkbox', name: "test" } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onChange'](mockEvent, customFunction);
      });


    });


    it("returns handleConditionalNavigation event handlers", () => {
      const formErrData = { formFieldErrors: { territory: "My User Territory", }, showErrors: true };
      useSelectorMock.mockReturnValue(formErrData);
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "click", eventHandler: "handleConditionalNavigation" }
      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text' } };
      };
      const navigationCondition = [{
        "or": [
          {
            "equals": {
              "selectAppTypeRadio": "biological"
            }
          }
        ],
        "then": "BiologicalSubstance"
      }];
      const requiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[] = []
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        '',
        requiredComponents
      );
      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { value: 'TestValue', type: 'text', name: "test" } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['click'](mockEvent, customFunction, navigationCondition, '', requiredComponents);
      });


    });

  });
  describe("[useEventHandlers-handleConditionalNavigation]", () => {
    const formErrData = { formFieldErrors: { territory: "My User Territory", }, showErrors: true };
    useSelectorMock.mockReturnValue(formErrData);
    const {
      bindEventHandlers,
    } = useEventHandlers();
    it("returns handleConditionalNavigation event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "click", eventHandler: "handleConditionalNavigation" }
      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'text', name: "test" } };
      };
      const navigationCondition = [{
        "or": [
          {
            "equals": {
              "selectAppTypeRadio": "biological"
            }
          }
        ],
        "then": "BiologicalSubstance"
      }];
      const requiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[] = []
      // Assert
      const result1 = bindEventHandlers(
        events,
        customFunction,
        navigationCondition,
        '',
        requiredComponents
      );
      act(() => {
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn(), target: { value: 'TestValue', type: 'text', name: "test" } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result1['click'](mockEvent, customFunction, navigationCondition, '', requiredComponents);
      });


    });
  })

  describe("[useEventHandlers-handleChange-with formData]", () => {
    const formData = { test: ['TestValue'] };
    const formTitleData = { test: ['mockTitle'] };
    useSelectorMock.mockReturnValue(formTitleData);
    useSelectorMock.mockReturnValue(formData);
    const {
      bindEventHandlers,
    } = useEventHandlers();
    it("returns handleChange event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onChange", eventHandler: "handleChange" },

      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'checkbox' } };
      };
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
      );

      act(() => {
        const mockEvent = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
          target: { title: "mockTitle", value: 'TestValue', type: 'checkbox', name: "test" }
        } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onChange'](mockEvent, customFunction);
      });

    });

  })
  describe("[useEventHandlers-handleChange-with formTitleData]", () => {
    const formData = { test: ['TestValue'] };
    const formTitleData = { test: ['mockTitle'] };


    useSelectorMock.mockReturnValue(formData);
    useSelectorMock.mockReturnValue(formTitleData);
    const {
      bindEventHandlers,
    } = useEventHandlers();
    it("returns handleChange event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onChange", eventHandler: "handleChange" },

      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'checkbox' } };
      };
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
      );

      act(() => {
        const mockEvent = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
          target: { title: "mockTitle", value: 'TestValue', type: 'checkbox', name: "test" }
        } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onChange'](mockEvent, customFunction);
      });
    });

  })
  describe("[useEventHandlers-handleChange-with formTitleData]", () => {
    const formData = { test: ['TestValue'] };
    const formTitleData = { test: ['mockTitle'] };
    const formErrData = { formFieldErrors: { test: "please remove" } }

    useSelectorMock.mockReturnValue(formData);
    useSelectorMock.mockReturnValue(formTitleData);
    useSelectorMock.mockReturnValue(formErrData);
    const {
      bindEventHandlers,
    } = useEventHandlers();
    it("returns handleChange event handlers", () => {
      //arrange
      const events: IEventConfigJsonProps[] = [
        { event: "onChange", eventHandler: "handleChange" },

      ];
      const customFunction = () => {
        return { target: { value: 'TestValue', type: 'checkbox' } };
      };
      // Assert
      const result = bindEventHandlers(
        events,
        customFunction,
      );

      act(() => {
        const mockEvent = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
          target: { title: "mockTitle", value: 'TestValue', type: 'checkbox', name: "test" }
        } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        result['onChange'](mockEvent, customFunction);
      });
    });

  });
  it("formData and formFieldsData are correctly rendered", () => {
    const formData = { test: ['TestValue'] };

    jest.mock('../useTriggerEvents');
    const mockTriggerEvent = jest.fn();
    (useTriggerEvents as jest.Mock).mockReturnValue({ triggerEvent: mockTriggerEvent });
    useSelectorMock.mockReturnValue(formData);

    const { formData: redxuData, } = useEventHandlers();
    expect(redxuData).toEqual(formData);
  });
  it("formData and formTitleData are correctly rendered", () => {
    const formTitleData = { test: ['mockTitle'] };

    jest.mock('../useTriggerEvents');
    const mockTriggerEvent = jest.fn();
    (useTriggerEvents as jest.Mock).mockReturnValue({ triggerEvent: mockTriggerEvent });
    useSelectorMock.mockReturnValue(formTitleData);

    const { formTitleData: redxuData, } = useEventHandlers();
    expect(redxuData).toEqual(formTitleData);
  });
  it("formData and formTitleData are correctly rendered", () => {

    const formErrData = { formFieldErrors: { test: "please remove" } }
    jest.mock('../useTriggerEvents');
    const mockTriggerEvent = jest.fn();
    (useTriggerEvents as jest.Mock).mockReturnValue({ triggerEvent: mockTriggerEvent });
    useSelectorMock.mockReturnValue(formErrData);

    const { formErrData: redxuData, } = useEventHandlers();
    expect(redxuData).toEqual(formErrData);
  });

  it("useSelector should be called with the correct selector function", () => {
    // Mock the useSelector behavior
    (Redux.useSelector as unknown as jest.Mock).mockReturnValueOnce(formDataSelector(mockState))
      .mockReturnValueOnce(formErrDataSelector(mockState))
      .mockReturnValueOnce(formTitleDataSelector(mockState));

    // Render the hook
    renderHook(() => useEventHandlers());
  });
});
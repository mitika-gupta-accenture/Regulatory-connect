import { useSelector } from "react-redux";
import useTriggerEvents from "./useTriggerEvents";
import useConditionEvaluator, {
  NavigationCondition
} from "./useConditionEvaluator";
import { ChangeEvent } from "react";
import { IChildrenJsonProps, IEventConfigJsonProps, INestedChildrenJsonProps } from "../types/common";
import { useValidate } from "./useValidate";
import { formDataSelector, formErrDataSelector, formTitleDataSelector } from "./customSelectors";

const useEventHandlers = () => {
  const { triggerEvent } = useTriggerEvents();
  const { validateAllFields, validateOneField } = useValidate()
  const { evaluateLogicalConditions } = useConditionEvaluator();
  const formData = useSelector(formDataSelector);
  const formTitleData = useSelector(formTitleDataSelector);
  const formErrData = useSelector(formErrDataSelector);

  const handleDeleteFieldData = (fieldName: string): void => {
    const item = {
      name: fieldName,
      value: "",
      title: "",
    };

    triggerEvent("deleteFormData", item);
    handleClearErrorFieldData(fieldName, formErrData);
  };

  const handleClearErrorFieldData = (
    fieldName: string,
    formErrorData: any
  ): void => {
    if (formErrorData["formFieldErr"]?.hasOwnProperty(fieldName)) {
      const target = {
        name: "formFieldErr",
        value: fieldName,
      };
      triggerEvent("formFieldErr", target);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    customFunction: (array: [] | string) => {},
    navigationCondition: string,
    apiDataHandler: string,
    component: IChildrenJsonProps[],
  ) => 
  {
    const { name, value, type } = e.target;
    let { title } = e.target;

    title =
      (type === "select-one" &&
        (e.target as HTMLSelectElement).selectedOptions[0].innerHTML) ||
      (title !== "" && title) ||
      value;

    if (formErrData["formFieldErrors"]?.hasOwnProperty(name) && formErrData["showErrors"]) {
      validateOneField(name, component[0].type, component[0].errorMessage, value)
    }

    if (type === "checkbox") {
      const oldSelectedValues =
        formData?.[name] ?? [];
      const oldSelectedTitles = formTitleData?.[name] ?? [];
      const newSelectedValues = oldSelectedValues.includes(value)
        ? oldSelectedValues.filter((item: string) => item !== value)
        : [...oldSelectedValues, value],
        newSelectedTitles = oldSelectedTitles.includes(title)
          ? oldSelectedTitles.filter((item: string) => item !== title)
          : [...oldSelectedTitles, title],
        item = {
          target: {
            name: name,
            value: newSelectedValues,
            title: newSelectedTitles,
          },
        };
      customFunction(newSelectedValues);
      triggerEvent("handleChange", item.target);
    }
    else {
      customFunction(value);
      const data = {
        target: {
          name,
          value,
          title,
        },
      };
      triggerEvent("handleChange", data.target);
    }
  }

  const handleAPICall = (
    e: ChangeEvent<HTMLInputElement>,
    customFunction: any,
    apicall: string
  ) => {
    const { name, value } = e.target;
    customFunction(value);
    value.length > 2 && triggerEvent(apicall, { name: name, value: value });
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement>,
    customFunction: () => {}
  ) => {
    console.log("Input blurred: ", e, customFunction);
    // Add your onBlur logic here
  };

  const handleConditionalNavigation = (
    e: ChangeEvent<HTMLInputElement>,
    customFunction: () => {},
    navigationCondition: NavigationCondition<{ [key: string]: any }>,
    apiDataHandler: string,
    requiredComponents: (IChildrenJsonProps | INestedChildrenJsonProps)[],
    specialFlowCondition?: Record<string, any> | any,
    
  ) => {
    const item = {
      target: {
        name: e.target.name,
        value: evaluateLogicalConditions(navigationCondition) || "",
      },
    };

    const toggleShowErrors = {
      target: {
        name: "showErrors",
        value: !formErrData["showErrors"],
      },
    };

    if (validateAllFields(requiredComponents)?.includes(false)) {
      formErrData["showErrors"] === false && triggerEvent("setShowErrors", toggleShowErrors.target);
    } else {
      formErrData["showErrors"] === true && triggerEvent("setShowErrors", toggleShowErrors.target);
      triggerEvent("nextPage", item.target);
    }

    if (specialFlowCondition) {
      const evaluatedResult = evaluateLogicalConditions(specialFlowCondition);
      if (evaluatedResult && evaluatedResult.length > 0) {
        evaluatedResult.forEach((obj: { name: any; value: any; title: any; }) => {
          const { name, value, title } = obj;
          const data = {
            target: {
              name: name,
              value: value,
              title: title 
            }
          };
          // Trigger the event for each object
          triggerEvent("handleChange", data.target);
        });
      }
    }

  }

  const clearSessionAndNavigate = (
    e: ChangeEvent<HTMLInputElement>,
    customFunction: () => {},
    navigationCondition: string
  ) => {
    sessionStorage.removeItem("applicationState");
    if (navigationCondition) {
      window.location.href = `/${navigationCondition}`;
    }
  };

  const handleOnClick = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    customFunction: (array: [] | string) => {}
  ) => {
    const { value } = e.target;
    customFunction(value);
  };

  const eventHandlers: Record<string, Function> = {
    handleChange,
    handleBlur,
    handleConditionalNavigation,
    handleDeleteFieldData,
    clearSessionAndNavigate,
    handleAPICall,
    handleOnClick,
    // Add more handlers as needed
  };

  const bindEventHandlers = (
    events: IEventConfigJsonProps[],
    customFunction?: (val?: any) => {},
    navigationCondition?: Record<string, any> | string,
    apiDataHandler?: string,
    requiredComponents?: (IChildrenJsonProps | INestedChildrenJsonProps)[],
    specialFlowCondition?: Record<string, any> | any,
    
  ) => {
    const boundEventHandlers: Record<string, Function> = {};
    if (Array.isArray(events)) {
      events.forEach((eventConfig: IEventConfigJsonProps) => {
        const { event, eventHandler } = eventConfig;
        // Need to check the next line ts interface
        boundEventHandlers[event] = (e: ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          e.stopPropagation();
          eventHandlers[eventHandler](
            e,
            customFunction,
            navigationCondition,
            apiDataHandler,
            requiredComponents,
            specialFlowCondition
          );
        };
      });
    }
    return boundEventHandlers;
  };

  return {
    bindEventHandlers,
    handleDeleteFieldData,
    handleClearErrorFieldData,
    formData,
    formTitleData,
    formErrData
  };
};

export default useEventHandlers;

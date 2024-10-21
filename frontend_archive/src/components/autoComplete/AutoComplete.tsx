import React, { useCallback, useEffect, useState } from "react";
import {
  ICompOptionProps,
  IEventConfigJsonProps,
} from "../../core/types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import { Input, ListItem, MultiChoice, UnorderedList } from "govuk-react";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import { useValidate } from "../../core/hooks/useValidate";
import { FIELD_TYPES } from "../../core/constants/fieldTypes";

export interface AutocompleteProps {
  apiDataId?: string;
  options?: ICompOptionProps[];
  name: string;
  events?: IEventConfigJsonProps[];
  text: string;
  toolTip?: string;
  disabled?: boolean;
  errorMessage?: string;
  style?: object;
  className?: string;
  apiDataHandler?: string;
  required?: boolean;
  displayOrder?: number;
  type?: string;
}

export const AutoComplete: React.FC<AutocompleteProps> = ({
  apiDataId = "",
  options = [],
  name = "",
  events = [
    {
      event: "onFocus",
      eventHandler: "handleChange",
    }
  ],
  text = "",
  toolTip = "",
  disabled = false,
  errorMessage = MESSAGE_CONSTANTS.AUTO_COMPLETE,
  className = "",
  apiDataHandler,
  required = true,
  type = FIELD_TYPES.AUTO_COMPLETE,
  ...restProps
}) => {
  const { triggerEvent } = useTriggerEvents();
  const { bindEventHandlers } = useEventHandlers();
  const { validateOneField } = useValidate()
  const [filteredOptions, setFilteredOptions] = useState<ICompOptionProps[]>([]);
  const formFieldData = useSelector(
    (state: RootState) =>
      state.applicationFormFieldsReducer.applicationFormFieldsData
  );
  const formData = useSelector(
    (state: RootState) => state.applicationFormReducer.applicationFormData
  );
  const formErrData = useSelector(
    (state: RootState) => state.applicationFormReducer.applicationFormFieldError
  );
  const [inputvalue, setInputValue] = useState(formData[name]);
  const [selectedOption, setSelectedOption] = useState(formData[name]);

  const handleInputChange = (value: string) => {
    triggerEvent('handleChange', {name, value})
    setInputValue(value);

    value.length < 2 && setFilteredOptions([])

    if (formErrData["formFieldErrors"]?.hasOwnProperty(name) && formErrData["showErrors"]) {
      validateOneField(name, type, errorMessage, value)
    }

    return {};
  };

  const handleOptionClick = (option: ICompOptionProps) => {
    option.value && setSelectedOption(option.value);
    option.title && setInputValue(option.title);

    events?.forEach((eventConfig: IEventConfigJsonProps) => {
      const { event, eventHandler } = eventConfig;
      if (event === "onSubmit" && option.value !== "") {
        const item = {
          target: {
            name: name,
            value: option.value || "",
          },
        };
        triggerEvent(eventHandler, item.target);
      }
    });

    (formErrData["formFieldErrors"]?.hasOwnProperty(name) && formErrData["showErrors"]) && triggerEvent('deleteFormFieldError', {value: name})

  };

  useEffect(() => {
    return () => triggerEvent('deleteFormFieldError', {value: name})
  }, []);

  const getOptions = useCallback(
    (fieldOptions: any[]) => {
      if (fieldOptions && Array.isArray(fieldOptions) && fieldOptions.length && inputvalue) {
        const filteredLicenceNums = fieldOptions.filter((num: string) => num.startsWith(inputvalue.toUpperCase()))
        const allOptions = filteredLicenceNums.map((option) => ({ title: option, value: option }));
        return allOptions.slice(0, 9)
      } else {
        return options || [];
      }
    },
    [options]
  );

  useEffect(() => {
    const renderOptionsFromApi =
      apiDataId !== "" && formFieldData && formFieldData[apiDataId];
    setFilteredOptions(() => {
      return renderOptionsFromApi
        ? getOptions(formFieldData[apiDataId])
        : options || [];
    });
  }, [formFieldData[apiDataId]]);

  return (
    <>
      <MultiChoice
        label={""}
        meta={{
          error: `ERROR: ${errorMessage}`,
          touched:
            formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
            formErrData["showErrors"],
        }}
      >
        <label className="govuk-label">{text}</label>
        <Input
          type="text"
          id={name}
          name={name}
          value={inputvalue}
          placeholder={toolTip}
          title={text}
          disabled={disabled}
          className={`${"govuk-input"} ${className}`}
          {...bindEventHandlers(events, handleInputChange, apiDataHandler, '', [restProps])}
        />
        <UnorderedList listStyleType="none">
  {selectedOption !== inputvalue && inputvalue !== "" && (
    filteredOptions?.map((option: ICompOptionProps) => (
      <ListItem
        key={option.value}
        onClick={() => handleOptionClick(option)}
        onKeyDown={(event: any) =>
          event.key === "Enter" && handleOptionClick(option)
        }
        className="autoCompleteSuggList"
        tabIndex={0}
      >
        {option.title}
      </ListItem>
    ))
  )}
  {selectedOption !== inputvalue && inputvalue !== "" && filteredOptions.length === 0 && (
    <ListItem
      key={"NoResults"}
      className="autoCompleteSuggList autoCompleteNoResFound"
      tabIndex={0}
    >
      No results found
    </ListItem>
  )}
</UnorderedList>
      </MultiChoice>
    </>
  );
};

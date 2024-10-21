import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Fieldset, FormGroup, Select } from "govuk-react";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import {
  IEventConfigJsonProps,
  ICompOptionProps,
} from "../../core/types/common";
import { RootState } from "../../core/store/store";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";

export interface IRcSelectProps {
  apiDataId?: string;
  options?: ICompOptionProps[];
  name: string;
  events?: IEventConfigJsonProps[];
  text: string;
  toolTip?: string;
  disabled?: boolean;
  errorMessage?: string;
  required?: boolean;
}

export const RcSelect = React.memo(
  ({
    apiDataId = "",
    options = [
      {
        title: "Option 1",
        value: "Option 1",
      },
      {
        title: "Option 2",
        value: "Option 2",
      },
    ],
    name = "",
    events = [
      {
        event: "onChange",
        eventHandler: "handleChange",
      },
    ],
    text = "",
    toolTip = "",
    disabled = false,
    errorMessage = MESSAGE_CONSTANTS.REQUIRED_FIELD,
    required = true,
    ...restProps
  }: IRcSelectProps) => {
    const { triggerEvent } = useTriggerEvents();
    const { bindEventHandlers } = useEventHandlers();
    const [fieldOptions, setOptions] = useState<ICompOptionProps[]>([]);
    const [selectedOption, setSelectedOption] = useState("");
    const formFieldData = useSelector(
      (state: RootState) =>
        state.applicationFormFieldsReducer.applicationFormFieldsData
    );
    const formData = useSelector(
      (state: RootState) => state.applicationFormReducer.applicationFormData
    );
    const formErrData = useSelector(
      (state: RootState) =>
        state.applicationFormReducer.applicationFormFieldError
    );

    useEffect(() => {
      return () => triggerEvent('deleteFormFieldError', {value: name})
    }, []);

    const getOptions = useCallback(
      (fieldOptions: any[]) => {
        if (
          fieldOptions &&
          Array.isArray(fieldOptions) &&
          fieldOptions.length
        ) {
          let updatedOptions = fieldOptions.map((option) => ({
            title: option,
            value: option,
          }));
          updatedOptions.unshift({
            title: options[0].title,
            value: options[0].value,
          });
          return updatedOptions;
        } else {
          return options || [];
        }
      },
      [options]
    );

    useEffect(() => {
      const renderOptionsFromApi =
        apiDataId &&
        apiDataId !== "" &&
        formFieldData &&
        formFieldData[apiDataId];
      setOptions(() => {
        return renderOptionsFromApi
          ? getOptions(formFieldData[apiDataId])
          : options || [];
      });
    }, [formFieldData, getOptions, apiDataId, options]);

    const formDataFeildName = formData[name];
    useEffect(() => {
      const selectedValue =
        formDataFeildName ||
        (fieldOptions && fieldOptions.length && fieldOptions[0].value) ||
        "";

      const item = {
        target: {
          name: name,
          value: selectedValue,
        },
      };
      if (events) {
        events.forEach((eventConfig: IEventConfigJsonProps) => {
          const { eventHandler } = eventConfig;
          // remove null check to select default placeholder
            formDataFeildName !== selectedValue &&
              triggerEvent(eventHandler, item.target);
            setSelectedOption(selectedValue);
        });
      }
    }, [formDataFeildName, triggerEvent, fieldOptions, events, name]);

    return (
      fieldOptions && (
        <FormGroup>
          <Fieldset>
            <Select
              input={{
                name: name,
                value: selectedOption,
                ...(events && {
                  ...bindEventHandlers(events, () => setSelectedOption, '','', [{...restProps}]),
                }),
              }}
              label={text}
              hint={toolTip}
              meta={{
                error: `ERROR: ${errorMessage}`,
                touched:
                  formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
                  formErrData["showErrors"],
              }}
            >
              {fieldOptions.length > 0 &&
                fieldOptions.map((option: ICompOptionProps, i: number) => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
            </Select>
          </Fieldset>
        </FormGroup>
      )
    );
  }
);

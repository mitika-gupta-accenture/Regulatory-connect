import React, { useEffect, useState } from "react";
import { Fieldset, FormGroup, InputField } from "govuk-react";
import { useSelector } from "react-redux";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import { IEventConfigJsonProps } from "../../core/types/common";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import { formDataSelector, formErrDataSelector } from "../../core/hooks/customSelectors";

export interface IRcInputProps {
  name: string;
  text: string;
  disabled?: boolean;
  events?: IEventConfigJsonProps[];
  value?: string;
  errorMessage?: string;
  style?: Object;
  required?: boolean;
}

export const RcInput = React.memo(
  ({
    name = "",
    text = "",
    disabled = false,
    events = [
      {
        event: "onChange",
        eventHandler: "handleChange",
      },
    ],
    value = "",
    errorMessage = MESSAGE_CONSTANTS.REQUIRED_FIELD,
    style = {},
    required = true,
    ...restProps
  }: IRcInputProps) => {
    const { triggerEvent } = useTriggerEvents();
    const { bindEventHandlers } = useEventHandlers();
    const [inputValue, setInputValue] = useState(
      value && value !== "" ? value : ""
    );

    const formData = useSelector(formDataSelector);
    const formErrData = useSelector(formErrDataSelector);

    useEffect(() => {
      return () => triggerEvent('deleteFormFieldError', {value: name})
    }, []);

    useEffect(() => {
      events &&
        events.forEach((eventConfig: IEventConfigJsonProps) => {
          const { eventHandler } = eventConfig;
          if (formData && formData[name] !== undefined) {
            setInputValue(formData[name]);
          } else if (value && value !== "") {
            const item = {
              target: {
                name: name,
                value: value,
              },
            };
            triggerEvent(eventHandler, item.target);
          }
        });
    }, [formData, value, triggerEvent, name, events]);

    return (
      <FormGroup>
        <Fieldset>
          <InputField
            input={{
              name: name,
              id: name,
              value: inputValue,
              style: style,
              maxLength:250,
              onChange: (e) => setInputValue(e.target.value)
            }}
            meta={{
              error: `ERROR: ${errorMessage}`,
              touched:
                formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
                formErrData["showErrors"],
            }}
            {...(events !== undefined && {
              ...bindEventHandlers(events, () => setInputValue, '','', [restProps]),
            })}
          >
            {text}
          </InputField>
        </Fieldset>
      </FormGroup>
    );
  }
);

import React, { useEffect, useState } from "react";
import { Label, TextArea } from "govuk-react";
import useStringModifier from "../../core/hooks/useStringModifier";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { IEventConfigJsonProps } from "../../core/types/common";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";

export interface RcTextAreaProps {
  text: string;
  name: string;
  displayOrder?: number;
  apiDataId?: string;
  hint: string;
  events?: IEventConfigJsonProps[];
  input: {
    name: string;
    value: string;
  };
  className?: string;
  errorMessage?: string;
  required?: boolean;
}

export const RcTextArea = React.memo(
  ({
    text = "",
    name = "",
    apiDataId = "",
    hint = "",
    events = [
      {
        event: "onChange",
        eventHandler: "handleChange",
      },
    ],
    className = "",
    errorMessage = MESSAGE_CONSTANTS.REQUIRED_FIELD,
    required = true,
    ...restProps
  }: RcTextAreaProps) => {
    const { getFinalString } = useStringModifier();
    const { triggerEvent } = useTriggerEvents();
    const { bindEventHandlers } = useEventHandlers();
    const finalString = getFinalString(hint, apiDataId);
    const formData = useSelector(
      (state: RootState) => state.applicationFormReducer.applicationFormData
    );
    const formErrData = useSelector(
      (state: RootState) =>
        state.applicationFormReducer.applicationFormFieldError
    );
    const [textAreaValue, setTextAreaValue] = useState("");

    useEffect(() => {
      return () => triggerEvent('deleteFormFieldError', {value: name})
    }, []);

    useEffect(() => {
      events &&
        events.forEach((eventConfig: IEventConfigJsonProps) => {
          const { eventHandler } = eventConfig;
          if (formData && formData[name] !== undefined) {
            setTextAreaValue(formData[name]);
          } else if (textAreaValue && textAreaValue !== "") {
            const item = {
              target: {
                name: name,
                value: textAreaValue,
                
              },
            };
            triggerEvent(eventHandler, item.target);
          }
        });
    }, [formData, textAreaValue, triggerEvent, name, events]);
    return (
      <div className="govuk-body govuk-!-margin-bottom-3">
        <Label className={className}>{finalString}</Label>
        <TextArea
          input={{
            name: name,
            value: textAreaValue,
            maxLength:2000,
            onChange: (e) => setTextAreaValue(e.target.value)
          }}
          meta={{
            error: `ERROR: ${errorMessage}`,
            touched:
              formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
              formErrData["showErrors"],
          }}
          {...(events !== undefined && {
            ...bindEventHandlers(events, () => setTextAreaValue, '','', [restProps]),
          })}
        >
          {text}
        </TextArea>
      </div>
    );
  }
);

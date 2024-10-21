import React, { useEffect, useState } from "react";
import { Fieldset, FormGroup, MultiChoice } from "govuk-react";
import { RcLabelWithCaption } from "../rcLabelWithCaption/RcLabelWithCaption";
import { RcCheckbox } from "../rcCheckbox/RcCheckbox";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import {
  ICompOptionProps,
  IEventConfigJsonProps,
} from "../../core/types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";

export interface IRcCheckBoxGroupProps {
  className?: string;
  size?: "MEDIUM" | "SMALL";
  inline?: boolean;
  visible?: boolean;
  disabled?: boolean;
  name: string;
  text: string;
  toolTip?: string;
  options?: ICompOptionProps[];
  events?: IEventConfigJsonProps[];
  errorMessage?: string;
  required?: boolean;
}

export const RcCheckBoxGroup = React.memo(
  ({
    className = "",
    size = "MEDIUM",
    inline = false,
    visible = true,
    disabled = false,
    name = "",
    text = "",
    toolTip = "",
    options = [],
    events = [
      {
        event: "onChange",
        eventHandler: "handleChange",
      },
    ],
    errorMessage = MESSAGE_CONSTANTS.REQUIRED_FIELD,
    required = true,
    ...restProps
  }: IRcCheckBoxGroupProps) => {
    // Initiate state for selected radio button
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const { bindEventHandlers } = useEventHandlers();
    const { triggerEvent } = useTriggerEvents();

    const formData = useSelector(
      (state: RootState) => state.applicationFormReducer.applicationFormData
    );
    const formErrData = useSelector(
      (state: RootState) =>
        state.applicationFormReducer.applicationFormFieldError
    );

    const formDataFieldValue = formData[name];

    useEffect(() => {
      return () => triggerEvent('deleteFormFieldError', {value: name})
    }, []);

    useEffect(() => {
      formDataFieldValue && setSelectedValues(formDataFieldValue);
    }, [formDataFieldValue]);

    return visible ? (
      <FormGroup>
        <Fieldset>
          {(text || toolTip) && (
            <Fieldset.Legend>
              <RcLabelWithCaption
                name={name}
                toolTip={toolTip}
                text={text}
                className={className}
                size={size}
              />
            </Fieldset.Legend>
          )}
          <MultiChoice
            label={""}
            meta={{
              error: `ERROR: ${errorMessage}`,
              touched:
                formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
                formErrData["showErrors"],
            }}
          >
            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
              {options?.map((elem: ICompOptionProps, i) => {
                const { title, value } = elem;
                return title ? (
                  <RcCheckbox
                    title={title}
                    value={value}
                    inline={inline}
                    size={size}
                    name={name}
                    text={text}
                    selectedValue={selectedValues}
                    className={className}
                    disabled={elem.disabled}
                    parentName={name}
                    key={Number(value)}
                    {...(events !== undefined && {
                      ...bindEventHandlers(events, () => setSelectedValues, '','', [restProps])
                    })}
                  />
                ) : (
                  <React.Fragment></React.Fragment>
                );
              })}
            </div>
          </MultiChoice>
        </Fieldset>
      </FormGroup>
    ) : (
      <React.Fragment></React.Fragment>
    );
  }
);

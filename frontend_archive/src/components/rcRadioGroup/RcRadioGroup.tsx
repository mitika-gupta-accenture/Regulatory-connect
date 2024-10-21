import React, { useEffect, useState } from "react";
import { Fieldset, FormGroup } from "govuk-react";
import { RcLabelWithCaption } from "../rcLabelWithCaption/RcLabelWithCaption";
import { RcRadio } from "../rcRadio/RcRadio";
import useEventHandlers from "../../core/hooks/useEventHandlers";
import {
  ICompOptionProps,
  IEventConfigJsonProps,
} from "../../core/types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import MultiChoice from "@govuk-react/multi-choice";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import useConditionEvaluator from "../../core/hooks/useConditionEvaluator";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";

export interface IRcRadioGroupProps {
  events?: IEventConfigJsonProps[];
  name: string;
  className?: string;
  size?: "MEDIUM" | "SMALL";
  inline?: boolean;
  options?: ICompOptionProps[];
  text: string;
  visible?: boolean;
  errorMessage?: string;
  toolTip?: string;
  label?: string;
  required?: boolean;
  displayOrder: number;
}

export const RcRadioGroup = React.memo(
  ({
    events = [
      {
        event: "onChange",
        eventHandler: "handleChange",
      },
    ],
    name,
    className = "",
    size = "MEDIUM",
    inline = false,
    options,
    text,
    visible = true,
    errorMessage = MESSAGE_CONSTANTS.ONE_OPTION,
    toolTip = "",
    label,
    required = true,
    ...restProps
  }: IRcRadioGroupProps) => {
    const [selectedValue, setSelectedValue] = useState("");
    const { bindEventHandlers, handleDeleteFieldData } = useEventHandlers();
    const { evaluateLogicalConditions } = useConditionEvaluator();
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
    const errorCondition = formErrData["formFieldErrors"]?.hasOwnProperty(name)
      ? formErrData["showErrors"]
      : false;
    useEffect(() => {
      formDataFieldValue &&
        setSelectedValue((prevFormDataFieldValue) => {
          options?.forEach((option) => {
            option.value === prevFormDataFieldValue &&
              prevFormDataFieldValue !== formDataFieldValue &&
              option.children &&
              option.children.forEach(
                (child) => child.name && handleDeleteFieldData(child.name)
              );
          });
          return formDataFieldValue;
        });

    }, [formDataFieldValue]);

    return visible ? (
      <FormGroup>
        <Fieldset>
          {text && (
            <Fieldset.Legend>
              <RcLabelWithCaption
                name={name}
                text={text}
                toolTip={toolTip}
                className={className}
                size={size}
              />
            </Fieldset.Legend>
          )}

          <MultiChoice
            label={label}
            meta={{
              error: `ERROR: ${errorMessage}`,
              touched: errorCondition,
            }}
          >
            <div className="govuk-radios" data-module="govuk-radios">
              {options &&
                options.map((elem: ICompOptionProps, i: number) => {
                  const { title, value, visibilityCondition = [] } = elem;
                  const isVisible =
                    title &&
                    (!visibilityCondition.length ||
                      evaluateLogicalConditions(
                        visibilityCondition,
                        name,
                        value
                      ));

                  return isVisible ? (
                    <RcRadio
                      {...elem}
                      title={title}
                      value={value}
                      inline={inline}
                      size={size}
                      selectedValue={selectedValue}
                      disabled={elem.disabled}
                      parentName={name}
                      key={value}
                      {...(events !== undefined && {
                        ...bindEventHandlers(events, () => setSelectedValue, '','', [{...restProps}]),
                      })}
                    />
                  ) : (
                    (name &&
                      formData[name]?.includes(value) &&
                      handleDeleteFieldData(name),
                    (<React.Fragment ></React.Fragment>))
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

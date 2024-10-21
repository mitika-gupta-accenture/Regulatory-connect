import React, { useEffect, useState } from "react";
import { DateField } from "govuk-react";
import { useSelector } from "react-redux";
import { IEventConfigJsonProps } from "../../core/types/common";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import { MESSAGE_CONSTANTS } from "../../core/constants/messages";
import { useValidate } from "../../core/hooks/useValidate";
import { formDataSelector, formErrDataSelector } from "../../core/hooks/customSelectors";

export interface RcDateFieldProps {
  text: string;
  name: string;
  hintText?: string;
  events?: IEventConfigJsonProps[];
  input?: {
    onChange?: (date: { day: string; month: string; year: string }) => unknown;
    onBlur?: (date: { day: string; month: string; year: string }) => void;
    onFocus?: (date: { day: string; month: string; year: string }) => void;
    value?: { day: string; month: string; year: string };
  };
  inputNames:
    | {
        month: any;
        year: any;
        day: any;
      }
    | any;
  inputs: {
    day: {
      autoComplete: string;
    };
    month: {
      autoComplete: string;
    };
    year: {
      autoComplete: string;
    };
  };
  errorMessage?: string;
  required?: boolean;
  type?: string;
}

export const RcDateField = React.memo(
  ({
    text,
    name,
    errorMessage = MESSAGE_CONSTANTS.DATE,
    hintText = "",
    input = {},
    inputNames,
    type = 'dateField',
    required = true,
  }: RcDateFieldProps) => {
    const { triggerEvent } = useTriggerEvents();
    const { validateDate } = useValidate()
    const formData = useSelector(formDataSelector);
    const formErrData = useSelector(formErrDataSelector);
    const storedDate = formData[name]
    const [day, setDay] = useState((storedDate?.day) || '');
    const [month, setMonth] = useState((storedDate?.month) || '');
    const [year, setYear] = useState((storedDate?.year) || '');

    useEffect(() => {
      return () => triggerEvent('deleteFormFieldError', {value: name})
    }, []);

    const handleDateChange = (e: any) => {
      const dateObject = { day, month, year}

      switch(e.target.name) {
        case inputNames[0].day:
          setDay(e.target.value)
          validateDate(name, errorMessage, type, { day: e.target.value, month, year})
          dateObject.day = e.target.value
          break

        case inputNames[0].month:
          setMonth(e.target.value)
          validateDate(name, errorMessage, type, { day, month: e.target.value, year})
          dateObject.month = e.target.value
          break

        case inputNames[0].year:
          setYear(e.target.value)
          validateDate(name, errorMessage, type, { day, month, year: e.target.value})
          dateObject.year = e.target.value
          break
      }

      triggerEvent("handleChange", { name, value: dateObject})
    };

    return (
        <DateField
          input={{
            onBlur: input.onBlur,
            onChange: input.onChange,
            onFocus: input.onFocus,
          }}
          inputNames={inputNames}
          inputs={{
            day: {
              name: inputNames[0].day,
              value: day,
              type: "number",
            },
            month: {
              name: inputNames[0].month,
              value: month,
              type: "number",
            },
            year: {
              name: inputNames[0].year,
              value: year,
              type: "number",
            },
          }}
          hintText={hintText}
          errorText={
            formErrData["formFieldErrors"]?.hasOwnProperty(name) &&
            formErrData["showErrors"] &&
            `ERROR: ${errorMessage}`
          }
          onChange={(e) => handleDateChange(e)}
        >
          {text}
        </DateField>
    );
  }
);

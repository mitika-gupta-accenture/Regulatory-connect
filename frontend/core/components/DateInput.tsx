import React, { useState } from 'react';
import { DateInput as DateInputGOVUK } from '@mhra/mhra-design-components';
import { ErrorSummaryType } from './ErrorSummary';
import FindErrorMessage from 'core/util/Errors';
import { DateInputProps } from '@mhra/mhra-design-components/dist/components/dateInput/dateInput.types';
import { Validation } from 'core/validation/types';

export interface DateInputsType {
  identifier: string;
  name: string;
  value: string;
  autoComplete?: string;
  validation?: Validation;
}
export interface DateInputFieldType extends DateInputProps {
  identifier: string;
  hint: string | undefined;
  type: 'date';
  fields: DateInputsType[];
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
}

function DateInput({
  field,
  errorSummary,
  previousAnswer,
}: {
  field: DateInputFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
}) {
  let prevAns: {
    day: string | undefined;
    month: string | undefined;
    year: string | undefined;
  } = { day: '', month: '', year: '' };
  const ans = previousAnswer?.split('-');
  prevAns = { day: ans?.[2], month: ans?.[1], year: ans?.[0] };
  const [date, setDate] = useState(prevAns);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const fieldName = name.split('--')[1];

    setDate(prevDate => ({
      ...prevDate,
      [fieldName]: value,
    }));
  };

  return (
    <DateInputGOVUK
      text={field.text}
      id={field.identifier}
      hintText={field.hint}
      inputs={{
        day: {
          name: field.fields[0].identifier,
          value: date?.day ?? '',
          autoComplete: 'off',
          errorMessage: FindErrorMessage(errorSummary, field.fields[0]) ?? '',
        },
        month: {
          name: field.fields[1].identifier,
          value: date?.month ?? '',
          autoComplete: 'off',
          errorMessage: FindErrorMessage(errorSummary, field.fields[1]) ?? '',
        },
        year: {
          name: field.fields[2].identifier,
          value: date?.year ?? '',
          autoComplete: 'off',
          errorMessage: FindErrorMessage(errorSummary, field.fields[2]) ?? '',
        },
      }}
      onChange={handleDateChange}
    />
  );
}

export default DateInput;

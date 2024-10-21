'use client';
import React, { useEffect, useState } from 'react';
import { Select as SelectLib } from '@mhra/mhra-design-components';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import {
  SelectOption,
  SelectProps,
} from '@mhra/mhra-design-components/dist/components/select/select.types';
import { FieldType } from './FieldFactory';
import { answer } from './Summary';
import { ApiResponseDataType } from 'core/validation/types';
import FindErrorMessage from 'core/util/Errors';

export type dataType = {
  productclasstype: SelectOption[];
  country: SelectOption[];
};

export interface SelectFieldType
  extends Omit<SelectProps, 'name' | 'label' | 'options'> {
  type: 'select';
  identifier: string;
  name?: string;
  label?: string;
  apiDataKey?: string;
  placeHolder?: string;
  fields?: FieldType[];
  answers: SelectOption[];
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  showChangeLinkInSummary?: boolean;
}

export default function Select({
  field,
  apiData,
  errorSummary,
  previousAnswer,
  allPreviousAnswers,
}: {
  field: SelectFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  apiData?: ApiResponseDataType;
  allPreviousAnswers?: answer[];
}) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    previousAnswer,
  );

  const errMsg = FindErrorMessage(errorSummary, field);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  const getOptionsFromAPIData = (
    data: ApiResponseDataType,
    apiDataKey: string,
    placeHolder: string,
  ): SelectOption[] => {
    const options: SelectOption[] = data
      ? data[apiDataKey].map(({ name, identifier }: ApiResponseDataType) => ({
          label: name,
          value: identifier,
        }))
      : [];
    return [{ label: placeHolder, value: '' }, ...options];
  };

  const options: SelectOption[] =
    apiData && field.apiDataKey && field.placeHolder
      ? getOptionsFromAPIData(apiData, field.apiDataKey, field.placeHolder)
      : [{ label: field.placeHolder || '', value: '' }, ...field.answers];

  return (
    <>
      <SelectLib
        name={field.identifier}
        label={field.label || ''}
        options={options}
        hint={field.hint}
        errorMessage={errMsg}
        defaultValue={selectedValue}
        onSelect={handleChange}
        className={field.className}
      />
    </>
  );
}

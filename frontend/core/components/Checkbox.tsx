'use client';

import React, { useEffect, useState } from 'react';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import FieldFactory, { FieldType } from './FieldFactory';
import { answer } from './Summary';
import FindErrorMessage from 'core/util/Errors';
import { Checkboxes } from '@mhra/mhra-design-components';
import {
  CheckboxOption,
  CheckboxProps,
} from '@mhra/mhra-design-components/dist/components/checkboxes/checkboxes.types';
import {
  Answer,
  ApiPropType,
  ApiResponseDataType,
} from 'core/validation/types';
import { mapApiDataToJson } from 'core/util/mapApiDataToJson';

export interface CheckboxFieldType extends CheckboxProps, ApiPropType {
  type: 'checkbox';
  identifier: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  name: string;
  answers: Answer[];
  showChangeLinkInSummary?: boolean;
}

export default function Checkbox({
  field,
  errorSummary,
  apiData,
  previousAnswer,
  allPreviousAnswers,
}: {
  field: CheckboxFieldType;
  apiData?: ApiResponseDataType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  allPreviousAnswers?: answer[];
}) {
  if (apiData) {
    if (field.apiDataKey && !field.answers?.[0]?.code) {
      field.answers =
        mapApiDataToJson(field, apiData[field.apiDataKey]) || field.answers; // Retain existing answers if transformation returns undefined or null
    }
    if (field.answers && !field.apiDataKey) {
      for (const answer of field.answers) {
        if (answer.fields) {
          for (const innerField of answer.fields) {
            if (innerField.apiDataKey) {
              field.answers =
                mapApiDataToJson(field, apiData[innerField.apiDataKey]) ||
                field.answers; // Retain existing answers if transformation returns undefined or null
            }
          }
        }
      }
    }
  }
  const [selected, setSelected] = useState<string[]>(() => {
    return (
      allPreviousAnswers
        ?.filter(answer => answer.identifier === field.identifier)
        .map(answer => answer.answer) || []
    );
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(prevSelected =>
      prevSelected.includes(value)
        ? prevSelected.filter(option => option !== value)
        : [...prevSelected, value],
    );
  };

  const errMsg = FindErrorMessage(errorSummary, field);

  const optionsList = field.answers.map(item => {
    const isSelected: boolean = selected.includes(item.value);
    const conditionalChildren = item.fields?.map((field, index) => (
      <FieldFactory
        key={index}
        field={field}
        errorSummary={errorSummary}
        previousAnswer={
          allPreviousAnswers?.find(
            answer => answer.identifier === field.identifier,
          )?.answer || ''
        }
        allPreviousAnswers={allPreviousAnswers}
      />
    ));
    return {
      value: item.value,
      label: item.label ?? item.value,
      conditionalChildren,
      defaultChecked: isSelected,
    } as CheckboxOption;
  });

  return (
    <Checkboxes
      id={field.identifier}
      label={field.label}
      hint={field.hint}
      name={field.identifier}
      className={field.className}
      withHeading={field.withHeading}
      children={field.children}
      isSmallerCheckboxes={field.isSmallerCheckboxes}
      errorMessage={errMsg}
      onChange={handleChange}
      options={optionsList}
    />
  );
}

'use client';

import React, { useState } from 'react';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import { answer } from './Summary';
import FieldFactory from './FieldFactory';
import { UploadFile } from 'core/models/file';
import { Radios } from '@mhra/mhra-design-components';
import FindErrorMessage from 'core/util/Errors';
import {
  RadiosProps,
  RadiosOption,
} from '@mhra/mhra-design-components/dist/components/radios/radios.types';
import {
  Answer,
  ApiPropType,
  ApiResponseDataType,
} from 'core/validation/types';
import { mapApiDataToJson } from 'core/util/mapApiDataToJson';

export interface RadioFieldType extends RadiosProps, ApiPropType {
  type: 'radio';
  identifier: string;
  id: string;
  answers: Answer[];
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

function Radio({
  field,
  files,
  apiData,
  errorSummary,
  previousAnswer,
  allPreviousAnswers,
}: {
  field: RadioFieldType;
  apiData?: ApiResponseDataType;
  files?: UploadFile[];
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  allPreviousAnswers?: answer[];
}) {
  //Later to be replaced by the API apiData, given only for testing
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
  const [selected, setSelected] = useState(
    field.answers?.filter(el => el.value === previousAnswer)[0]?.value || '',
  );

  const handleChange = (e: any) => {
    setSelected(e.target.value);
  };

  const errMsg = FindErrorMessage(errorSummary, field);

  const optionsList = field.answers?.map(item => {
    const isSelected: boolean = selected === item.value;
    let conditionalChildren = null;
    if (item?.fields?.length) {
      conditionalChildren = item.fields.map((field, index) => (
        <FieldFactory
          key={index}
          field={field}
          files={files}
          errorSummary={errorSummary}
          previousAnswer={
            allPreviousAnswers?.find(
              answer => answer.identifier === field.identifier,
            )?.answer || ''
          }
          allPreviousAnswers={allPreviousAnswers}
          apiData={apiData}
        />
      ));
    }
    let defaultProps: RadiosOption = {
      value: item.value,
      label: item.label ?? item.value,
      hint: item?.hint ?? '',
      conditionalChildren,
    };

    if (isSelected) {
      defaultProps = { ...defaultProps, defaultChecked: isSelected };
    }
    return defaultProps;
  });
  return (
    <Radios
      id={field.identifier}
      withHeading={field.withHeading}
      children={field.children}
      isInlineRadios={field.isInlineRadios}
      isSmallerRadios={field.isSmallerRadios}
      label={field.label}
      hint={field?.hint}
      name={field.identifier}
      className={field?.className}
      errorMessage={errMsg}
      onChange={handleChange}
      options={optionsList}
    />
  );
}

export default Radio;

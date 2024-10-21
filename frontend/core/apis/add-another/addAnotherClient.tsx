'use client';
import { StateFieldType, addAnotherBehavior } from './actions';
import FieldFactory, { FieldType } from 'core/components/FieldFactory';
import InputWithDelete from './InputWithDelete';
import { GridRow } from '@mhra/mhra-design-components';
import { ApiResponseDataType } from 'core/validation/types';
import { ErrorSummaryType } from 'core/components/ErrorSummary';

export default function AddAnotherClient({
  field,
  answers,
  apiData,
  errorSummary,
}: {
  field: FieldType;
  answers: StateFieldType[];
  apiData?: ApiResponseDataType;
  errorSummary: ErrorSummaryType;
}) {
  const firstFieldID = field.identifier!;
  const addAnotherField = addAnotherBehavior.bind(null, field, firstFieldID);
  const buttonType =
    field?.addMoreButtonType === 'secondary' ? 'govuk-button--secondary' : '';
  const buttonMarginClass = answers?.length === 1 ? 'govuk-!-margin-top-6' : '';
  return (
    <>
      <GridRow>
        {answers.map((a, i) => {
          return i === 0 ? (
            <FieldFactory
              key={i}
              field={a}
              errorSummary={errorSummary}
              previousAnswer={a?.value}
              apiData={apiData}
            />
          ) : (
            <InputWithDelete
              key={Math.random()}
              field={a}
              firstFieldID={firstFieldID}
              apiData={apiData}
              errorSummary={errorSummary}
            />
          );
        })}
      </GridRow>
      <GridRow>
        <button
          formAction={addAnotherField}
          id="govuk-button"
          className={`govuk-button ${buttonMarginClass} ${buttonType}`.trim()}
          data-module="govuk-button"
          data-cy="govuk-button"
        >
          {field?.addMoreButtonText ?? 'Add another'}
        </button>
      </GridRow>
    </>
  );
}

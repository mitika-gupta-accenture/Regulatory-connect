'use client';

import FieldFactory from 'core/components/FieldFactory';
import { StateFieldType, removeAnotherBehaviour } from './actions';
import { VisuallyHidden } from '@mhra/mhra-design-components';
import { ApiResponseDataType } from 'core/validation/types';
import { ErrorSummaryType } from 'core/components/ErrorSummary';

export default function InputWithDelete({
  field,
  firstFieldID,
  apiData,
  errorSummary,
}: {
  field: StateFieldType;
  firstFieldID: string;
  apiData?: ApiResponseDataType;
  errorSummary: ErrorSummaryType;
}) {
  const removeAction = removeAnotherBehaviour.bind(null, field, firstFieldID);
  const cleanLabel = field.label.replace(/\bEnter\b/g, '').trim();
  const ariaLabel = `Delete ${cleanLabel}`;
  return (
    <div>
      <FieldFactory
        field={field}
        errorSummary={errorSummary}
        previousAnswer={field.value}
        apiData={apiData}
      >
        <button
          formAction={removeAction}
          className="govuk-link convert-button-to-link govuk-!-margin-bottom-6 govuk-!-padding-0 govuk-!-margin-top-3"
          data-module="govuk-button"
          aria-label={ariaLabel}
        >
          Delete
          <VisuallyHidden>{cleanLabel}</VisuallyHidden>
        </button>
      </FieldFactory>
    </div>
  );
}

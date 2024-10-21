'use client';

import React from 'react';
import FieldFactory, { FieldType } from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';
import { answer } from './Summary';
import { Details as DetailsLib } from '@mhra/mhra-design-components';
import { DetailsProps } from '@mhra/mhra-design-components/dist/components/details/details.types';

export interface DetailsAnswerType {
  fields: FieldType[];
}

export interface DetailsFieldType extends DetailsProps {
  type: 'details';
  identifier?: string;
  fields: FieldType[];
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

function Details({
  field,
  errorSummary,
  allPreviousAnswers,
  apiData,
}: {
  field: DetailsFieldType;
  errorSummary: ErrorSummaryType;
  allPreviousAnswers?: answer[];
  apiData?: Object;
}) {
  return (
    <DetailsLib
      heading={field.heading}
      open={field.open}
      id={field.identifier}
      className={field.className}
    >
      {field.fields.map((field, index) => (
        <FieldFactory
          key={index}
          field={field}
          errorSummary={errorSummary}
          allPreviousAnswers={allPreviousAnswers}
          previousAnswer={
            allPreviousAnswers?.find(
              answer => answer.identifier === field.identifier,
            )?.answer || ''
          }
          apiData={apiData}
        />
      ))}
    </DetailsLib>
  );
}

export default Details;

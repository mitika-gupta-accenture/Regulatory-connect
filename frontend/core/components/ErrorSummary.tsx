"use client";

import { Heading, UnorderedList } from '@mhra/mhra-design-components';
import React from 'react';

export interface ErrorType {
  linkId: string;
  message: string;
}

export interface ErrorSummaryType {
  title: string;
  errors: ErrorType[]
}

function ErrorSummary({
  errorSummary
}: {
  errorSummary: ErrorSummaryType;
}) {
  const listItems = errorSummary.errors.map((err: ErrorType) => ({
    href: err.linkId,
    text: err.message,
  }));

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" data-module="govuk-error-summary" role="alert" tabIndex={-1}>
      <Heading
        className="govuk-error-summary__title"
        level={2}
        id="error-summary-title" text={''}>
        {errorSummary.title}
      </Heading>
      <div className="govuk-error-summary__body">
        <UnorderedList className="govuk-error-summary__list" listItems={listItems} />
      </div>
    </div>
  );
}

export default ErrorSummary;

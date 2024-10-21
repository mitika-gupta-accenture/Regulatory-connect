'use client';
import React from 'react';

function PhaseBanner() {
  return (
    <div className="govuk-phase-banner" data-testid="PhaseBanner-render">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">
          Beta
        </strong>
        <span className="govuk-phase-banner__text">
          This is a new service. Help us improve it and{' '}
          <a
            id="govuk-feedback-link"
            className="govuk-link"
            href="mailto:"
            data-cy="govuk-feedback-link"
          >
            give your feedback (opens in new tab)
          </a>
          .
        </span>
      </p>
    </div>
  );
}
export default PhaseBanner;

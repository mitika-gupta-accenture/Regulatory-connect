import React from 'react';
import { clear } from 'core/models/redis';

async function ClearSessionButton() {
  return (
    <form action={clear}>
      <button
        type="submit"
        id="govuk-button"
        className="govuk-button"
        data-module="govuk-button"
        data-cy="govuk-button"
      >
        Clear session data
      </button>
    </form>
  );
}

export default ClearSessionButton;

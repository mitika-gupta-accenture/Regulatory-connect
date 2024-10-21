'use client';
import React from 'react';
import {
  addName,
  removeName,
} from './PreviousNamesServer';
import { FieldType } from 'core/components/FieldFactory';

type OrganisationContact = {
  email: string;
  isPrimary: boolean;
};

type AddContactsProps = {
  field: FieldType;
  current: string[];
  errors: string[];
};

export default function PreviousNamesClient({
  field,
  current,
}: AddContactsProps) {
  const addNameAction = addName.bind(null, field.identifier!);
  const removeNameAction = removeName.bind(null, field.identifier!);
  const fieldId = field.identifier ?? 'previous-name';
  const textFieldId = `${fieldId}-text`;

  return (
    <>
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
        <h2 className="govuk-fieldset__heading">Add a previous name</h2>
      </legend>
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor={textFieldId}>
          Previous name
        </label>
        <input
          className="govuk-input"
          id={textFieldId}
          name={textFieldId}
          type="text"
        />
      </div>
      <button
        formAction={addNameAction}
        className="govuk-button govuk-button--secondary"
      >
        Add to list
      </button>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dd className="govuk-summary-list__value"></dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        {current.map(c => (
          <div className="govuk-summary-list__row">
            <dd className="govuk-summary-list__value">{c}</dd>
            <dd className="govuk-summary-list__actions">
              <a
                onClick={() => removeNameAction(c)}
                className="govuk-link govuk-link--no-visited-state server-action-link"
              >
                Remove
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <input
        type="hidden"
        value={JSON.stringify(current)}
        id={field.identifier}
        name={field.identifier}
      />
    </>
  );
}

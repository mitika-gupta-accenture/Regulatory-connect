'use client';
import React from 'react';
import {
  addContact,
  setContactPrimary,
  removeContact,
} from './AddContactsServer';
import { FieldType } from 'core/components/FieldFactory';

type OrganisationContact = {
  email: string;
  isPrimary: boolean;
};

type AddContactsProps = {
  field: FieldType;
  current: OrganisationContact[];
  errors: string[];
};

export default function AddContactsClient({
  field,
  current,
}: AddContactsProps) {
  const addContactAction = addContact.bind(null, field.identifier!);
  const removeContactAction = removeContact.bind(null, field.identifier!);
  const makePrimaryContactAction = setContactPrimary.bind(
    null,
    field.identifier!,
  );

  return (
    <>
      <p className="govuk-body">
        These are the contact details of the people authorised to communicate
        with MHRA about your organisation.
      </p>
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
        <h2 className="govuk-fieldset__heading">Add a new contact</h2>
      </legend>
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="email">
          Email
        </label>
        <input
          className="govuk-input"
          id={field.identifier ?? 'email'}
          name="email"
          type="email"
          autoComplete="email"
          spellCheck="false"
        />
      </div>
      <button
        formAction={addContactAction}
        className="govuk-button govuk-button--secondary"
      >
        Add to list
      </button>
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--m">
          Confirm the primary contact for your organisation
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header" scope="col">
              Email
            </th>
            <th className="govuk-table__header" scope="col">
              Role
            </th>
            <th className="govuk-table__header" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {current.map(c => (
            <tr className="govuk-table__row" key={c.email}>
              <td className="govuk-table__cell">{c.email}</td>
              <td className="govuk-table__cell">
                {c.isPrimary ? (
                  'Primary contact'
                ) : (
                  <a
                    onClick={() => makePrimaryContactAction(c.email)}
                    className="govuk-link govuk-link--no-visited-state server-action-link"
                  >
                    Make primary contact
                  </a>
                )}
              </td>
              <td className="govuk-table__cell">
                <a
                  onClick={() => removeContactAction(c.email)}
                  className="govuk-link govuk-link--no-visited-state server-action-link"
                >
                  Remove
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="hidden"
        value={current.length > 0 ? JSON.stringify(current) : ''}
        id={field.identifier}
        name={field.identifier}
      />
    </>
  );
}

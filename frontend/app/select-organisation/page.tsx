'use client';
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import * as session from '../../core/models/redis';
import setSelectedOrganisation from './actions';
import { Organisation, UserDetails } from 'core/models/apiModel';
import _ from 'lodash';

export default function Page() {
  const [organisations, setOrganisations] = useState([] as Organisation[]);
  const [currentOrganisation, setCurrentOrganisation] = useState(
    {} as Organisation,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formVariables, formAction] = useFormState(
    setSelectedOrganisation,
    null,
  );

  useEffect(() => {
    const getUsersOrganisations = async () => {
      try {
        const userDetails = (await session.get('userDetails')) as UserDetails;
        const selectedOrganisation = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        setOrganisations(_.uniqBy(userDetails.organisations, 'name'));
        setCurrentOrganisation(selectedOrganisation);
      } catch (error) {
        console.error('Error fetching organisation details:', error);
      }
    };

    void getUsersOrganisations();
  }, []);

  return (
    <>
      <h1 className="govuk-heading-xl govuk-!-margin-top-4 govuk-!-margin-bottom-8">
        Select your organisation
        {currentOrganisation && (
          <span className="govuk-caption-m">{currentOrganisation.name}</span>
        )}
      </h1>

      <p className="govuk-body">
        If you consult on behalf of and are affiliated with more than one
        organisation, you can select a different organisation below.
      </p>

      <form className="govuk-form-group" action={formAction}>
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 className="govuk-fieldset__heading">
                Your affiliated organisations
              </h1>
            </legend>
            <p className="govuk-body">
              These are the organisations you are affiliated with. Select one.
            </p>
            <div className="govuk-radios" data-module="govuk-radios">
              {/*  */}
              {organisations.map(organisation => {
                return (
                  <div
                    className="govuk-radios__item"
                    key={organisation.identifier}
                  >
                    <input
                      className="govuk-radios__input"
                      id={organisation.name}
                      name="selectedOrganisationRadio"
                      type="radio"
                      defaultChecked={
                        currentOrganisation &&
                        organisation.name === currentOrganisation.name
                      }
                      value={JSON.stringify(organisation)}
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor={organisation.name}
                    >
                      {organisation.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        </div>
        <div>
          <p className="govuk-body">
            Select Confirm and continue to change the organisation and return to
            the Account home page.
          </p>
        </div>
        <button
          type="submit"
          className="govuk-button"
          data-module="govuk-button"
        >
          Confirm and continue
        </button>
      </form>
      <div>
        <a href="/dashboard" className="govuk-body govuk-link">
          Return to Account home
        </a>
      </div>
      <div className="govuk-!-margin-top-9">
        <a href="/problem" target="_blank" className="govuk-body govuk-link">
          Report a problem with this page (opens in new tab)
        </a>
      </div>
    </>
  );
}

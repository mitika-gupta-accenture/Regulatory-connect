'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as session from '../../../core/models/redis';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Button, GridWrapper } from '@mhra/mhra-design-components';
import {
  validateFormData,
  ValidateReturnType,
} from 'core/util/validateFormData';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const dynamic = 'force-dynamic';

export default function FormPage() {
  const [errorMessages, setErrorMessages] = useState<ValidateReturnType[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleContinue = async (e: React.FormEvent) => {
    const newErrorMessages = validateFormData(formData);
    if (newErrorMessages.length > 0) {
      e.preventDefault();
      setErrorMessages(newErrorMessages);
    } else {
      setErrorMessages([]);
    }
  };

  const ActionButtons = () => {
    return (
      <div className="govuk-grid-column-one-third govuk-!-padding-left-0">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half govuk-!-padding-left-0">
            <Button
              id="continue-button"
              text="Continue"
              aria-label="Continue"
              data-cy="continue-button"
              data-testid="continue-button"
            />
          </div>
          <div className="govuk-grid-column-one-half">
            <div className="govuk-grid-column-one-half">
              <Link
                href="/user-registration/cancel-application"
                id="govuk-button-group-child"
              >
                <Button
                  id="cancel-button"
                  buttonType="secondary"
                  text="Cancel"
                  aria-label="Cancel"
                  data-cy="cancel-button"
                  data-testid="cancel-button"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const savedFormData = (await session.get(
          'microsoftUserDetails',
        )) as string;
        if (savedFormData) {
          const parsedData: FormData = JSON.parse(savedFormData) as FormData;
          setFormData(parsedData);
        }
      } catch (error) {
        console.error('Error loading form data from Redis:', error);
      }
    };

    loadFormData().catch(error =>
      console.error('Error in loadFormData:', error),
    );
  }, [isAuthenticated, accounts, instance]);

  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content">
            <Link
              id="back-link"
              className="govuk-back-link"
              aria-label="Back"
              href="/"
              data-cy="back-link"
              data-testid="back-link"
            >
              Back
            </Link>
            {errorMessages.length > 0 && (
              <div
                className="govuk-error-summary"
                data-module="govuk-error-summary"
              >
                <div role="alert">
                  <h2 className="govuk-error-summary__title">
                    There is a problem
                  </h2>
                  <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">
                      {errorMessages.map((error, index) => (
                        <li key={index}>
                          <a href="#declaration-error">{error.message}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <h1 className="govuk-heading-xl">Confirm your details</h1>
            <form
              action="/user-registration/declaration"
              method="post"
              onSubmit={handleContinue}
            >
              <dl className="govuk-summary-list">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">First name</dt>
                  <dd className="govuk-summary-list__value">
                    {formData.firstName}
                  </dd>
                  <dd className="govuk-summary-list__actions">
                    <a
                      id="change-link"
                      className="govuk-link"
                      type="button"
                      href="update-your-details"
                      data-cy="change-link"
                      data-testid="change-link"
                    >
                      Change
                    </a>
                  </dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Last name</dt>
                  <dd className="govuk-summary-list__value">
                    {formData.lastName}
                  </dd>
                  <dd className="govuk-summary-list__actions">
                    <a
                      id="change-link"
                      className="govuk-link"
                      type="button"
                      href="update-your-details"
                      data-cy="change-link"
                      data-testid="change-link"
                    >
                      Change
                    </a>
                  </dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Email</dt>
                  <dd className="govuk-summary-list__value">
                    {formData.email}
                  </dd>
                </div>
              </dl>
              <div className="govuk-grid-row">
                <p className="govuk-body">
                  The Continue button will take you to the declaration page.
                </p>
                <ActionButtons />
              </div>
              <div className="govuk-grid-row govuk-!-padding-top-5 govuk-!-padding-bottom-5">
                <p>
                  <Link
                    id="help-link"
                    className="govuk-link"
                    aria-label="Get Help with this page"
                    href="/contactmhra"
                    rel="noreferrer noopener"
                    data-cy="help-link"
                    target="_blank"
                    data-testid="help-link"
                  >
                    Get Help with this page
                  </Link>
                </p>
              </div>
              <div className="govuk-grid-row govuk-!-padding-bottom-5">
                <p>
                  <Link
                    id="new-tab-link"
                    className="govuk-link govuk-!-margin-top-5"
                    aria-label="Is this page not working properly (opens in new tab)?"
                    href="#"
                    rel="noreferrer noopener"
                    data-cy="new-tab-link"
                    target="_blank"
                    data-testid="new-tab-link"
                  >
                    Is this page not working properly (opens in new tab)?
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}

'use client';
import { useState, useEffect } from 'react';
export const dynamic = 'force-dynamic';
import * as session from '../../../core/models/redis';
import Link from 'next/link';
import {
  validateFormData,
  ValidateReturnType,
} from 'core/util/validateFormData';
import { Button, GridWrapper } from '@mhra/mhra-design-components';

type FormData = {
  firstName: string;
  lastName: string;
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
  });
  const [errorMessages, setErrorMessages] = useState<ValidateReturnType[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const formData = (await session.get('microsoftUserDetails')) as string;
        if (formData) {
          setFormData(JSON.parse(formData) as FormData);
        }
      } catch (error) {
        console.error('Error loading form data from Redis:', error);
      }
    };

    loadFormData().catch(error =>
      console.error('Error in loadFormData:', error),
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    const newErrorMessages = validateFormData(formData).filter(
      error => error.key === 'first name' || error.key === 'last name',
    );
    if (newErrorMessages.length > 0) {
      e.preventDefault();
      setErrorMessages(newErrorMessages);
    } else {
      setErrorMessages([]);
      try {
        await session.set('microsoftUserDetails', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to Redis:', error);
      }
    }
  };

  const getErrorMessage = (field: string) => {
    return errorMessages
      .filter(error => error.key === field.toLowerCase())
      .map(error => error.message);
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
                href="/user-registration/confirm-your-details"
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

  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content">
            <a href="confirm-your-details" className="govuk-back-link">
              Back
            </a>
            {!!errorMessages.length && (
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

            <h1 className="govuk-heading-xl">Update your details</h1>
            <form
              action="confirm-your-details"
              method="post"
              onSubmit={handleContinue}
            >
              <div
                className={`govuk-form-group ${!!getErrorMessage('first name').length && 'govuk-form-group--error'}`}
              >
                <label className="govuk-label">First name</label>
                {!!getErrorMessage('first name').length && (
                  <p id="first-name-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{' '}
                    {getErrorMessage('first name')}
                  </p>
                )}
                <input
                  className="govuk-input"
                  id="first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className={`govuk-form-group ${!!getErrorMessage('last name').length && 'govuk-form-group--error'}`}
              >
                <label className="govuk-label">Last name</label>
                {getErrorMessage('last name') && (
                  <p id="last-name-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{' '}
                    {getErrorMessage('last name')}
                  </p>
                )}
                <input
                  className="govuk-input"
                  id="last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="govuk-grid-row">
                <p className="govuk-body">
                  The Continue button will take you to the Confirm your details
                  page.
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
                    target="_blank"
                    data-cy="help-link"
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
                    target="_blank"
                    data-cy="new-tab-link"
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

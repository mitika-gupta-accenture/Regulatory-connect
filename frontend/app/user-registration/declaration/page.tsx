'use client';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { continueDeclarationForm } from './actions';
import * as session from '../../../core/models/redis';
import { Button, GridWrapper } from '@mhra/mhra-design-components';

interface FormVariables {
  valid: boolean;
  userDetails: string | null;
}

export default function Page() {
  const [formVariables, formAction] = useFormState<FormVariables>(
    continueDeclarationForm,
    {
      valid: true,
      userDetails: null,
    },
  );

  const ActionButtons = () => {
    return (
      <div className="govuk-grid-column-one-third govuk-!-padding-left-0">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half govuk-!-padding-left-0">
            <Button
              id="submit-button"
              text="Submit"
              aria-label="Submit"
              data-cy="submit-button"
              data-testid="submit-button"
            ></Button>
          </div>
          <div className="govuk-grid-column-one-half">
            <Link href="/user-registration/cancel-application">
              <div className="govuk-grid-column-one-half govuk-!-padding-left-0">
                <Button
                  id="cancel-button"
                  className="govuk-button govuk-button--secondary"
                  text="Cancel"
                  aria-label="Cancel"
                  data-cy="cancel-button"
                  data-testid="cancel-button"
                ></Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const formData = (await session.get('microsoftUserDetails')) as string;
        if (formData) {
          formVariables.userDetails = formData;
        }
      } catch (error) {
        console.error('Error loading form data from Redis:', error);
      }
    };

    loadFormData().catch(error =>
      console.error('Error in loadFormData:', error),
    );
  }, [formVariables]);

  return (
    <GridWrapper>
      <form action={formAction}>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div id="main-content">
              <Link
                id="back-link"
                className="govuk-back-link"
                aria-label="Back"
                href="confirm-your-details"
                data-cy="back-link"
                data-testid="back-link"
              >
                Back
              </Link>
              {!formVariables.valid ? (
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
                        <li>
                          <a href="#declaration-error">
                            You must agree to the declaration
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
              <h1 className="govuk-heading-xl">Declaration</h1>
              <h4 className="govuk-heading-s">
                Read the following statements carefully:
              </h4>
              <div
                className={
                  !formVariables.valid
                    ? 'govuk-form-group govuk-form-group--error'
                    : 'govuk-form-group'
                }
              >
                <fieldset
                  className="govuk-fieldset"
                  aria-describedby="declaration-error"
                >
                  {!formVariables.valid ? (
                    <p id="declaration-error" className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span> You
                      must agree to the declaration
                    </p>
                  ) : null}
                  <div
                    className="govuk-checkboxes"
                    data-module="govuk-checkboxes"
                  >
                    <div className="govuk-checkboxes__item">
                      <input
                        id="mhra-terms-and-conditions-checkbox"
                        className="govuk-checkboxes__input"
                        name="declaration"
                        type="checkbox"
                        value="mhra-terms-and-conditions-checkbox"
                        data-cy="mhra-terms-and-conditions-checkbox"
                        data-testid="mhra-terms-and-conditions-checkbox"
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor="mhra-terms-and-conditions-checkbox"
                      >
                        I have read and agreed to{' '}
                        <Link
                          id="govuk-terms-and-conditions-mhra-link"
                          className="govuk-link"
                          aria-label="MHRA's terms and conditions"
                          href="https://info.mhra.gov.uk/forms/terms_and_conditions.aspx"
                          data-cy="govuk-terms-and-conditions-mhra-link"
                          data-testid="govuk-terms-and-conditions-mhra-link"
                          target="_blank"
                        >
                          MHRA's terms and conditions (opens in new tab)
                        </Link>
                        .
                      </label>
                    </div>
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="mhra-privacy-notice-checkbox"
                        name="declaration"
                        type="checkbox"
                        value="mhra-privacy-notice-checkbox"
                        data-cy="mhra-privacy-notice-checkbox"
                        data-testid="mhra-privacy-notice-checkbox"
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor="mhra-privacy-notice-checkbox"
                      >
                        I have read and agreed to{' '}
                        <Link
                          id="govuk-privacy-notice-mhra-link"
                          className="govuk-link"
                          aria-label="MHRA's privacy notice"
                          href="https://www.gov.uk/government/publications/mhra-privacy-notice/mhra-privacy-notice"
                          data-cy="govuk-privacy-notice-mhra-link"
                          data-testid="govuk-privacy-notice-mhra-link"
                          target="_blank"
                        >
                          MHRA's privacy notice (opens in new tab)
                        </Link>
                        .
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="govuk-grid-row ">
                <p className="govuk-body">
                  By submitting your information, you acknowledge that MHRA can
                  use the information you provide to meet its legal obligations.
                </p>
                <ActionButtons />
              </div>
              <div className="govuk-grid-row govuk-!-padding-top-0">
                <p>
                  <Link
                    id="new-tab-link"
                    className="govuk-link"
                    aria-label="Report a problem with this page (opens in new tab)"
                    href="#"
                    rel="noreferrer noopener"
                    target="_blank"
                    data-cy="new-tab-link"
                    data-testid="new-tab-link"
                  >
                    Report a problem with this page (opens in new tab)
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </GridWrapper>
  );
}

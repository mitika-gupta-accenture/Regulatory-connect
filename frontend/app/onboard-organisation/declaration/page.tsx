'use client';
import { useState } from 'react';
import BackButton from 'core/util/BackButton';
import Button from '../../../core/components/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [hasError, setHasError] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isChecked = (
      document.getElementById('declaration') as HTMLInputElement
    ).checked;
    if (!isChecked) {
      setHasError(true);
    } else {
      setHasError(false);
      window.location.href = '/onboard-organisation/confirmation';
    }
  };

  return (
    <main>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <BackButton previousPage={'check-and-confirm-answers'} />
          <div id="main-content">
            <h1
              className="govuk-hint govuk-!-margin-top-4 govuk-!-margin-bottom-2"
              id="Onboard an organisation"
            >
              Onboard an organisation
            </h1>
            <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">
              Declaration
            </h1>
            <br />
            <br />
            {hasError && (
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
                        <a href="#declaration">
                          You must agree to the declaration
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <div className="govuk-warning-text">
              <span className="govuk-warning-text__icon" aria-hidden="true">
                !
              </span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-visually-hidden">Warning</span>
                Once submitted, you will no longer be able to make changes to
                this request.
              </strong>
            </div>
            <form onSubmit={handleSubmit}>
              <div
                className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''}`}
              >
                <fieldset
                  className="govuk-fieldset"
                  aria-describedby="declaration-hint declaration-error"
                >
                  {hasError && (
                    <p id="declaration-error" className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>{' '}
                      <strong>You must agree to the declaration</strong>
                    </p>
                  )}
                  <legend className="govuk-fieldset__legend">
                    <strong>I declare that:</strong>
                  </legend>
                  <div
                    className="govuk-checkboxes"
                    data-module="govuk-checkboxes"
                  >
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="declaration"
                        name="declaration"
                        type="checkbox"
                        aria-describedby="declaration-item-hint"
                      />
                      <label
                        className="govuk-label govuk-checkboxes__label"
                        htmlFor="declaration"
                      >
                        I am authorised to submit this request on behalf of my
                        organisation.
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <p className="govuk-body">
                <strong>
                  By submitting this request, you agree to the following:
                </strong>
              </p>
              <ul className="govuk-list govuk-list--bullet">
                <li>You are authorised to approve and submit this request</li>
                <li>
                  The details provided are complete and accurate to the best of
                  your knowledge
                </li>
                <li>
                  MHRA may contact you or your company regarding this request
                </li>
              </ul>
              <br />
              <div className="govuk-button-group">
                <div>
                  <Button type="submit" name="Submit" text={'Submit'} />
                </div>
                <Link href="cancel-application">
                  <button
                    type="submit"
                    className="govuk-button govuk-button--secondary"
                    data-module="govuk-button"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

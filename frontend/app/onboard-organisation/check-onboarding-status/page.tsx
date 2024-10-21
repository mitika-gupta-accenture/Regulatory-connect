'use client';
import { useEffect, useState, useRef } from 'react';
import FieldFactory from 'core/components/FieldFactory';
import GetOrganisationNameRadios from 'core/apis/cam/GetOrganisationNameRadios';
import { submitOrganisationName } from './actions';
import { useFormState } from 'react-dom';
import { GridWrapper } from '@mhra/mhra-design-components';
import Link from 'next/link';
import { ErrorSummaryType } from 'core/components/ErrorSummary';
import { RadioFieldType } from 'core/components/Radio';

interface OrganisationResponse {
  field: RadioFieldType | null;
  count: number;
}

export default function Page() {
  const [userInput, setUserInput] = useState<string>('');
  const [field, setField] = useState(null as RadioFieldType | null);
  const [resultCount, setResultCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [formReturnState, formAction] = useFormState(submitOrganisationName, {
    errorSummary: {
      title: 'There is a problem',
      errors: [],
    } as ErrorSummaryType,
  });

  const updateField = async (input: string) => {
    setIsTyping(true);
    try {
      const { field: updatedField, count }: OrganisationResponse =
        await GetOrganisationNameRadios(input);
      setField(updatedField || null);
      setResultCount(count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setField(null);
      setResultCount(0);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (userInput.trim().length >= 3) {
      debounceTimeout.current = setTimeout(async () => {
        await updateField(userInput);
      }, 300);
    } else {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
      setField(null);
      setResultCount(0);
      setIsTyping(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
    };
  }, [userInput]);

  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content">
            <span className="govuk-caption-xl">Onboard an organisation</span>
            <h1 className="govuk-heading-xl">
              Check your organisation has not already been onboarded
            </h1>
            <div>
              <p className="govuk-body">
                Enter your organisation's name below to see if it already has a
                RegulatoryConnect account.
              </p>
              <p className="govuk-body">
                If your organisation's name appears in the search results, it
                has already been onboarded and you will not be able to register
                it again.
              </p>
              <p className="govuk-body">
                If your organisation's name does not appear in the search
                results, you can continue to onboard your organisation.
              </p>
            </div>

            <form action={formAction}>
              <div
                className={`govuk-form-group ${!!formReturnState.errorSummary.errors.some(error => error?.linkId === 'organisationName') && 'govuk-form-group--error'}`}
              >
                <h1 className="govuk-label-wrapper">
                  <label className="govuk-label" htmlFor="organisation-name">
                    Organisation name
                  </label>
                </h1>

                {!!formReturnState.errorSummary.errors.some(
                  error => error?.linkId === 'organisationName',
                ) && (
                  <p className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{' '}
                    {formReturnState.errorSummary.errors.map(
                      error =>
                        error.linkId === 'organisationName' && error?.message,
                    )}
                  </p>
                )}
                <input
                  className={`govuk-input ${formReturnState.errorSummary.errors.some(error => error?.linkId === 'organisationName') ? 'govuk-input--error' : ''}`}
                  id="organisation-name"
                  name="organisationName"
                  placeholder="Start typing your organisation name"
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                />
              </div>

              {userInput && !isTyping && userInput.trim().length >= 3 && (
                <>
                  {resultCount > 0 ? (
                    <p className="govuk-body">
                      There {resultCount === 1 ? 'is' : 'are'} {resultCount}{' '}
                      compan
                      {resultCount === 1 ? 'y' : 'ies'} with the name [
                      {userInput}]
                    </p>
                  ) : (
                    <div className="inset-error">
                      <h2 className="govuk-heading-m">No results</h2>
                      <p className="govuk-body">
                        You need to add your organisation for a
                        RegulatoryConnect account
                      </p>
                    </div>
                  )}
                </>
              )}

              {isTyping && <p className="govuk-body">Loading results...</p>}
              {field && (
                <FieldFactory
                  field={field}
                  errorSummary={formReturnState.errorSummary}
                />
              )}
              {resultCount > 0 && (
                <div className="govuk-warning-text" style={{ margin: '0px' }}>
                  <span className="govuk-warning-text__icon" aria-hidden="true">
                    !
                  </span>
                  <strong className="govuk-warning-text__text">
                    <span className="govuk-visually-hidden">Warning</span>
                    Your organisation has already been registered on the
                    RegulatoryConnect portal and cannot be onboarded again.
                  </strong>
                  <p>
                    An administrator role has already been assigned for your
                    organisation - speak to your organisation's administrator.
                  </p>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <p className="govuk-body" style={{ fontWeight: 'bold' }}>
                  If you need help
                </p>
                <p className="govuk-body">
                  <a
                    className="govuk-link"
                    href="https://www.gov.uk/guidance/contact-mhra"
                    target="_blank"
                  >
                    Contact MHRA (opens in a new tab)
                  </a>{' '}
                  if you have any questions about registering on Regulatory
                  Connect.
                </p>
              </div>
              {resultCount === 0 ? (
                <div
                  className="govuk-button-group"
                  style={{ paddingTop: '20px' }}
                >
                  <Link href="/onboard-organisation/organisation-location">
                    <button
                      type="button"
                      className="govuk-button"
                      data-module="govuk-button"
                    >
                      Continue
                    </button>
                  </Link>
                </div>
              ) : (
                <div
                  className="govuk-button-group"
                  style={{ paddingTop: '20px' }}
                >
                  <div>
                    <button
                      type="submit"
                      className="govuk-button"
                      data-module="govuk-button"
                    >
                      Return Account management
                    </button>
                  </div>

                  <Link href="/cancel-application">
                    <button
                      type="button"
                      className="govuk-button govuk-button--secondary"
                      data-module="govuk-button"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              )}
              <div className="govuk-grid-row" style={{ paddingTop: '20px' }}>
                <p>
                  <Link
                    id="new-tab-link"
                    className="govuk-link"
                    aria-label="Report a problem with this page (opens in new tab)"
                    href="#"
                    rel="noreferrer noopener"
                    target="_blank"
                    data-testid="new-tab-link"
                  >
                    Report a problem with this page (opens in new tab)
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

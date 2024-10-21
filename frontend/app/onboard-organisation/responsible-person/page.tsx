'use client';

import Button from '../../../core/components/Button';
import Link from 'next/link';
import { Details, GridWrapper } from '@mhra/mhra-design-components';
import { confirmAppointedPerson } from '../actions';
import { useFormState } from 'react-dom';
export const dynamic = 'force-dynamic';

type ResponsiblePersonState = {
  areYouAuthorised: boolean | null;
  error: string | null;
};

const initialState: ResponsiblePersonState = {
  areYouAuthorised: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useFormState<ResponsiblePersonState>(
    confirmAppointedPerson,
    initialState,
  );

  const ActionButtons = () => {
    return (
      <div className="govuk-button-group">
        <Button
          id="onboard-organisation-button"
          text="Onboard your organisation"
          aria-label="Onboard your organisation"
          data-cy="onboard-organisation-button"
          data-testid="onboard-organisation-button"
        ></Button>
        <Link
          href="/onboard-organisation/cancel-application"
          id={'govuk-button-group-child'}
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
    );
  };

  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content">
            {state.error && (
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
                        <a href="#areYouAuthorised">{state.error}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <span className="govuk-caption-xl">Onboard an organisation</span>
            <h1 className="govuk-heading-xl">Appointed person confirmation</h1>
            <form action={formAction}>
              <div
                className={`govuk-form-group ${state.error && 'govuk-form-group--error'}`}
              >
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend">
                    Are you authorised to act on behalf of your organisation?
                  </legend>
                  {state.error && (
                    <p
                      id="areYouAuthorised-error"
                      className="govuk-error-message"
                    >
                      <span className="govuk-visually-hidden">Error: </span>{' '}
                      {state.error}
                    </p>
                  )}
                  <div className="govuk-radios" data-module="govuk-radios">
                    <div className="govuk-radios__item">
                      <input
                        className="govuk-radios__input"
                        id="areYouAuthorised"
                        name="areYouAuthorised"
                        type="radio"
                        value="Yes"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="areYouAuthorised"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="govuk-radios__item">
                      <input
                        className="govuk-radios__input"
                        id="areYouAuthorised-2"
                        name="areYouAuthorised"
                        type="radio"
                        value="No"
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor="areYouAuthorised-2"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="govuk-form-group">
                <p className="govuk-body">
                  If you selected yes, you can continue to onboard your
                  organisation.
                </p>
                <p className="govuk-body">
                  Make sure you read the Organisation onboarding guidance before
                  you continue.
                </p>
                <Details
                  id="onboarding-organisation-guidance-details"
                  heading="Organisation onboarding guidance"
                >
                  <div>
                    <p className="govuk-body">
                      You will be required to enter your organisation's details,{' '}
                      including:
                    </p>
                    <ul className="govuk-list govuk-list--bullet">
                      <li>company name or registration number</li>
                      <li>
                        any previous names your organisation has traded with
                      </li>
                      <li>
                        email address of a senior employee for MHRA
                        communication purposes
                      </li>
                      <li>
                        the billing email and address for your organisation
                      </li>
                    </ul>
                    <p className="govuk-body">
                      Depending on your organisation's legal status, you will be
                      required to supply one of the following documents:
                    </p>
                    <ul className="govuk-list govuk-list--bullet">
                      <li>VAT certificate</li>
                      <li>certificate of incorporation</li>
                      <li>HMRC Self Assessment form</li>
                      <li>charity registration certificate</li>
                      <li>evidence of registration as mutual society</li>
                      <li>
                        evidence of your organisation's official name and date
                        of incorporation/authorisation
                      </li>
                      <li>good practice (GxP) certificate</li>
                    </ul>
                  </div>
                </Details>
                <p className="govuk-body govuk-!-font-weight-bold">
                  If you need help
                </p>
                <p className="govuk-body">
                  <Link
                    id="govuk-contact-mhra-link"
                    className="govuk-link"
                    aria-label="Contact MHRA"
                    href="https://www.gov.uk/guidance/contact-mhra"
                    rel="noreferrer noopener"
                    data-cy="contact-mhra-link"
                    target="_blank"
                    data-testid="contact-mhra-link"
                  >
                    Contact MHRA (opens in a new tab)
                  </Link>{' '}
                  if you have any questions about registering on
                  RegulatoryConnect.
                </p>
                <div className="govuk-grid-row" style={{ paddingTop: '20px' }}>
                  <p className="govuk-body">
                    Continue to onboard your organisation.
                  </p>
                  <ActionButtons />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}

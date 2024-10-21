import Link from 'next/link';
import Button from '../../../core/components/Button';
import { GridWrapper } from '@mhra/mhra-design-components';
export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content" className="govuk-!-margin-top-4">
            <div className="govuk-panel govuk-panel--confirmation">
              <h1 className="govuk-panel__title">Account request submitted</h1>
            </div>
            <p className="govuk-body-l govuk-!-padding-top-7">
              We have sent you an email confirming your request to create a user
              account.
            </p>
            <p className="govuk-body-l">
              To complete your account registration, you will need to complete
              the steps below.
            </p>
            <h2 className="govuk-heading-l">Next steps</h2>
            <p className="govuk-body">
              If you are an adminstrator acting on behalf of your organisation,
              you can continue to onboard your organisation.
            </p>
            <p className="govuk-body">
              Once approved, your account registration on RegulatoryConnect will
              be complete.
            </p>
            <p className="govuk-body">
              If you are not an administrator, you will need to contact your
              organisation admin and request to be added as an affiliate for
              your organisation.
            </p>
            <p className="govuk-body">
              Once you have been affiliated, your request to create an account
              on RegulatoryConnect will be complete.
            </p>
            <p className="govuk-body">
              For further information, visit the{' '}
              <Link
                id="onboarding-guidance-link"
                className="govuk-link"
                aria-label="Onboarding guidance page"
                href="#"
                data-cy="onboarding-guidance-link"
                data-testid="onboarding-guidance-link"
              >
                Onboarding guidance page
              </Link>
              .
            </p>
            <p className="govuk-body">
              Select Continue to complete your organisation's onboarding steps.
            </p>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-half  govuk-!-padding-left-0">
                <Link href="/onboard-organisation">
                  <Button
                    id="continue-button"
                    text="Continue"
                    aria-label="Continue"
                    data-cy="continue-button"
                    data-testid="continue-button"
                  ></Button>
                </Link>
              </div>
            </div>
            <div className="govuk-grid-row govuk-!-padding-top-5 govuk-!-padding-bottom-5">
              <p>
                <Link
                  id="website-survey-link"
                  className="govuk-link"
                  aria-label="What did you think of this service?"
                  href="#"
                  rel="noreferrer noopener"
                  data-cy="website-survey-link"
                  target="_blank"
                  data-testid="website-survey-link"
                >
                  What did you think of this service? (takes 30 seconds)
                </Link>
              </p>
            </div>
            <div className="govuk-grid-row govuk-!-padding-bottom-5">
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
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}

import { Details, Button, GridWrapper } from '@mhra/mhra-design-components';
import { SignInButton } from 'core/components/SignInButton';
export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default async function Home() {
  return (
    <GridWrapper className="govuk-!-margin-top-4">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">
            RegulatoryConnect online services: sign in or set up an account
          </h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">
            Sign into RegulatoryConnect services
          </h1>
          <p className="govuk-body">
            This is the latest version of the RegulatoryConnect service, which
            includes some new features.
          </p>
          <p className="govuk-body">
            RegulatoryConnect will become your single point of contact with MHRA
            to submit new applications and receive updates on those already
            submitted.
          </p>
          <p className="govuk-body">
            Use your MHRA account details to sign in to RegulatoryConnect.
          </p>
          <SignInButton>
            <Button
              id="sign-in-link"
              text="Sign in"
              aria-label="Sign in"
              href="#"
              data-cy="sign-in-link"
              data-testid="sign-in-link"
            />
          </SignInButton>
          <Details heading="I cannot sign in using my existing credentials">
            In some cases, you may be denied access to RegulatoryConnect if the
            URL has not already been added to your organisation's list of
            permitted URLs. If you are having issues signing in, contact your IT
            department.
          </Details>
          <h2 className="govuk-heading-l">
            Create a RegulatoryConnect account
          </h2>
          <p className="govuk-body">
            If you do not already have a RegulatoryConnect account, you will
            need to{' '}
            <SignInButton>
              <Link
                id="create-account-link"
                className="govuk-link"
                aria-label="Create an account"
                href="#"
                data-cy="create-account-link"
                data-testid="create-account-link"
              >
                create your account
              </Link>
              .
            </SignInButton>
          </p>
          <Details
            id="registration-guidance-id"
            heading="Registration guidance"
            className=" govuk-!-padding-top-3"
          >
            <div>
              <p className="heading-small">
                There are two steps to the registration process:
              </p>
              <h4 className="heading-small">
                Step 1: Sign in with your Microsoft email address or create a
                Microsoft email account
              </h4>
              <p className="govuk-body">
                If you already have a Microsoft email address (work or
                personal), use these details to sign in and create a
                RegulatoryConnect account.
              </p>
              <p className="govuk-body">
                If you don't have a Microsoft email address, you need to create
                one first. You'll also need to set up multi-factor
                authentication (MFA) for your account.
              </p>
            </div>
            <h4 className="heading-small">
              Step 2: Register your account in RegulatoryConnect
            </h4>
            <p className="govuk-body">
              Once you have a Microsoft email address and MFA set up, you can
              register for a RegulatoryConnect account.
            </p>
          </Details>
          <p className="govuk-body">
            Other MHRA account details will not work with RegulatoryConnect.
          </p>
          <h3 className="govuk-heading-m">
            If you have a query regarding the registration process
          </h3>
          <p className="govuk-body">
            You can{' '}
            <Link
              id="contact-mhra-link"
              className="govuk-link"
              aria-label="Contact MHRA"
              href="/contactmhra"
              data-cy="contact-mhra-link"
              data-testid="contact-mhra-link"
              rel="noreferrer noopener"
              target="_blank"
            >
              contact MHRA (opens in new tab)
            </Link>{' '}
            if you have any queries about registering on RegulatoryConnect.
          </p>
          <div className="govuk-grid-row govuk-!-padding-top-9">
            <p>
              <Link
                id="new-tab-link"
                className="govuk-link"
                aria-label="Report a problem with this page (opens in new tab)"
                href="/contactmhra"
                rel="noreferrer noopener"
                target="_blank"
                data-testid="new-tab-link"
              >
                Report a problem with this page (opens in new tab)
              </Link>
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-blue-border-top">
            <h3 className="heading-medium">Related Content</h3>
            <div className="govuk-grid-row">
              <SignInButton>
                <Link
                  id="sign-in-link"
                  className="govuk-link"
                  aria-label="Sign in"
                  href="#"
                  data-cy="sign-in-link"
                  data-testid="sign-in-link"
                >
                  Sign in
                </Link>
              </SignInButton>
            </div>
            <div className="govuk-grid-row govuk-!-margin-top-3">
              <SignInButton>
                <Link
                  id="create-account-link"
                  className="govuk-link"
                  aria-label="Create an account"
                  href="#"
                  data-cy="create-account-link"
                  data-testid="create-account-link"
                >
                  Create an account
                </Link>
              </SignInButton>
            </div>
            <div className="govuk-grid-row govuk-!-margin-top-3">
              <Link
                id="contact-mhra-link"
                className="govuk-link"
                aria-label="Contact MHRA"
                href="/contactmhra"
                data-cy="contact-mhra-link"
                data-testid="contact-mhra-link"
              >
                Contact MHRA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GridWrapper>
  );
}

import { GridWrapper } from '@mhra/mhra-design-components';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <GridWrapper>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div id="main-content" className="govuk-!-margin-top-4">
            <h1 className="govuk-heading-xl">Account Management</h1>
            <h2 className="govuk-heading-l">Onboard your organisation</h2>
            <div className="govuk-form-group">
              <p className="govuk-body">
                Register your organisation to submit and track applications, and
                view authorisation details online.
              </p>
              <a
                id="onboard-your-organisation-link"
                className="govuk-link"
                href="/onboard-organisation/responsible-person"
              >
                Onboard your organisation
              </a>
            </div>
          </div>
        </div>
      </div>
      <br />
    </GridWrapper>
  );
}

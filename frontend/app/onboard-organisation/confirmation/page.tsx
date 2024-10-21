export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main>
      <br />
      <br />
      <br />
      <div className="govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-panel govuk-panel--confirmation">
              <h1 className="govuk-panel__title">Application complete</h1>
              <div className="govuk-panel__body">
                Your reference number
                <br />
                <strong>HDJ2123F</strong>
              </div>
            </div>
            <p className="govuk-body">We have sent you a confirmation email.</p>
            <h2 className="govuk-heading-m">What happens next</h2>
            <p className="govuk-body">
              We’ve sent your application to Hackney Electoral Register Office.
            </p>
            <p className="govuk-body">
              They will contact you either to confirm your registration, or to
              ask for more information.
            </p>
            <p className="govuk-body">
              <a href="#" className="govuk-link">
                What did you think of this service?
              </a>{' '}
              (takes 30 seconds)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

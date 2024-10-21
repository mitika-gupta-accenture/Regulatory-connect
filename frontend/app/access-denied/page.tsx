import { Button, GridWrapper } from '@mhra/mhra-design-components';
import BackButton from 'core/util/BackButton';
export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default async function Home() {
  return (
    <main className="govuk-main-wrapper">
      <BackButton previousPage={''} />
      <GridWrapper className="govuk-!-margin-top-4">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-xl">
              You do not have permission to perform this action
            </h1>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <p className="govuk-body">
              You do not have permission to access this page. If you believe you
              should have access, contact your organisation admin.
            </p>
            <Link href={`/select-organisation`}>
              <Button
                id="select-organisation-button"
                className="govuk-button"
                text="Change Organisation"
                aria-label="select organisation"
                data-cy="select-organisation-button"
                data-testid="select-organisation-button"
              ></Button>
            </Link>
          </div>
        </div>
      </GridWrapper>
    </main>
  );
}

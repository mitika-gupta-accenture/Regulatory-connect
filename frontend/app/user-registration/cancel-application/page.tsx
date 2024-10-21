'use-client';
export const dynamic = 'force-dynamic';

import {
  GridCol,
  GridRow,
  GridWrapper,
  Heading,
  Paragraph,
} from '@mhra/mhra-design-components';
import { cancelUserRegistrationApplication } from 'app/actions';
import BackButton from 'core/util/BackButton';

async function CancelButton() {
  return (
    <form action={cancelUserRegistrationApplication}>
      <button
        type="submit"
        id="govuk-button"
        className="govuk-button govuk-button--warning"
        data-module="govuk-button"
        data-cy="govuk-button"
      >
        Cancel application
      </button>
    </form>
  );
}

export default async function Home() {
  return (
    <>
      <BackButton />
      <GridWrapper>
        <GridRow>
          <GridCol className="two-thirds govuk-!-padding-left-0">
            <Heading
              className="govuk-heading-l govuk-!-padding-top-7"
              size="xl"
              text="Cancel your application"
            />
            <Paragraph
              text={
                'If you cancel your application, all the information you have entered will be lost.'
              }
              className="govuk-body"
              id={''}
            />
            <Paragraph
              text={'Are you sure that you want to cancel your application?'}
              id={''}
            />
          </GridCol>
        </GridRow>
        <br />
        <GridRow>
          <GridCol className="two-thirds govuk-!-padding-left-0">
            <CancelButton />
          </GridCol>
        </GridRow>
      </GridWrapper>
    </>
  );
}

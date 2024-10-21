import {
  GridCol,
  GridRow,
  GridWrapper,
  Heading,
  Paragraph,
} from '@mhra/mhra-design-components';

export default async function Page() {
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <div id="main-content" className="govuk-!-margin-top-4">
            <Heading size="l" text="You cannot use this service" />
            <Paragraph
              text={'You cannot proceed with this application'}
              className="govuk-body"
              id={''}
            />
            <Paragraph
              text={
                'You can contact MHRA for further information at info@MHRA.gov.uk'
              }
              className="govuk-body"
              id={''}
            />
          </div>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

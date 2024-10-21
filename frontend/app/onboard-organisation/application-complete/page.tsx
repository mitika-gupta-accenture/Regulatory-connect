import { GridCol, GridRow, GridWrapper } from '@mhra/mhra-design-components';

export default function Page() {
  return (
    <GridWrapper>
      <GridRow>
        <br></br>
        <GridCol className="two-thirds govuk-!-margin-top-2">
          <h1 className="govuk-heading-l">Onboard organisation completed </h1>
        </GridCol>
        <GridCol className="two-thirds govuk-!-margin-top-2">
          <p className="govuk-body">
            Your draft application has been created. You can read it on the
            'Check your progress' page
          </p>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

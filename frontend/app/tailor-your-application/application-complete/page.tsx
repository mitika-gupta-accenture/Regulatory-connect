import {
  GridCol,
  GridRow,
  GridWrapper,
  Heading,
  Paragraph,
} from '@mhra/mhra-design-components';

export default function Page() {
  return (
    <GridWrapper>
      <GridRow>
        <br></br>
        <GridCol className="two-thirds govuk-!-margin-top-2">
          <Heading text="Tailor your application completed" size="l" />
        </GridCol>
        <GridCol className="two-thirds govuk-!-margin-top-2">
          <Paragraph
            text={
              "Your draft application has been created. You can read it on the 'Check your progress' page"
            }
            id={''}
          />
        </GridCol>
        <GridCol className="two-thirds govuk-!-margin-top-2">
          <Heading size="m" text="What you can do now" />
          <ul className="govuk-list">
            <li>
              <a className="govuk-link" href="#">
                Go to next section: Submission details
              </a>
            </li>
            <li>
              <a className="govuk-link" href="#">
                Go to Check your progress
              </a>
            </li>
            <li>
              <a className="govuk-link" href="#">
                Go to Your application home page
              </a>
            </li>
          </ul>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

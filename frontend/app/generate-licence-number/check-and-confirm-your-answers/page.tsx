import Link from 'next/link';

import {
  Button,
  Caption,
  GridCol,
  GridRow,
  GridWrapper,
  Heading,
} from '@mhra/mhra-design-components';
import generateLicenceQuestions from 'core/fields/pl/generate-licence-number/index';
import { submitGenerateLicenceNumber } from '../actions';
import { Metadata } from 'next';
import Summary, { AnswersType } from 'core/components/Summary';
import { getAllAnswersAction } from 'app/actions';
import ScrollToTop from 'core/components/ScrollToTop';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Check and confirm your answers',
  };
}
async function getOrderedAnswers() {
  const answers = (await getAllAnswersAction()) as AnswersType[];
  return answers.sort(sortAnswers);
}
function sortAnswers(a: AnswersType, b: AnswersType) {
  return (
    generateLicenceQuestions.map(q => q.question).indexOf(a.question) -
    generateLicenceQuestions.map(q => q.question).indexOf(b.question)
  );
}
export default async function Page() {
  const answers = await getOrderedAnswers();
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <ScrollToTop />
          <div className="govuk-!-padding-top-7">
            <form action={submitGenerateLicenceNumber}>
              <Heading size={'l'} text="">
                <Caption
                  id={`caption-generate-licence-number`}
                  size="l"
                  text={'Generate a licence number'}
                />
                Check and confirm your answers
              </Heading>
              <Summary
                answers={answers}
                formPath={'generate-licence-number'}
                title={''}
              />
              <div className="govuk-button-group">
                <Button
                  name="confirm-submit-button"
                  disabled={false}
                  text={'Confirm'}
                />
                <Link
                  href="/cancel-application"
                  role="button"
                  className="govuk-button govuk-button--secondary"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

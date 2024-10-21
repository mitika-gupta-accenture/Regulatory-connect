import Summary, { AnswersType } from 'core/components/Summary';
import { getAllAnswersAction } from 'app/actions';
import tyaQuestions from 'core/fields/pl/tailor-your-application/index';
import Link from 'next/link';

//doesnt do anything yet
import {
  Button,
  GridCol,
  GridRow,
  GridWrapper,
} from '@mhra/mhra-design-components';
import { submitPlTailorYourApp } from '../actions';

export const dynamic = 'force-dynamic';

async function getOrderedAnswers() {
  const answers = (await getAllAnswersAction()) as AnswersType[];
  // answers.map(a => sortAnswerFields(a));
  return answers.sort(sortAnswers);
}

// answers to fields still display in a weird order -
// I think custom submission pages are probably the way to go for RC per service?

function sortAnswers(a: AnswersType, b: AnswersType) {
  return (
    tyaQuestions.map(q => q.question).indexOf(a.question) -
    tyaQuestions.map(q => q.question).indexOf(b.question)
  );
}

// function sortAnswerFields(at: AnswersType) {
//   const questionFields = tyaQuestions
//     .find(q => q.question === at.question)
//     ?.fields.flat(Infinity);
//
//   return at.answers?.sort((a: answer, b: answer): number => {
//     return (
//       questionFields?.map(f => f.identifier).indexOf(a.identifier) -
//       questionFields?.map(f => f.identifier).indexOf(b.identifier)
//     );
//   });
// }

export default async function Page() {
  const answers = await getOrderedAnswers();
  console.dir(answers, { depth: null });
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <form action={submitPlTailorYourApp}>
            <Summary answers={answers} formPath="pl-tailor-your-application" />
            <div className="govuk-inset-text">
              Once you save this information you will not be able to change it.
              If you need to make changes, you will need to delete this
              application and start again.
            </div>
            <Button
              name="confirm-submit-button"
              disabled={false}
              text={'Confirm and Submit'}
            />
          </form>
          <Link href="/cancel-application">
            <Button text={'Cancel application'} buttonType="secondary" />
          </Link>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

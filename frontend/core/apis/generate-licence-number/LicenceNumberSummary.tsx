import Summary, { AnswersType } from 'core/components/Summary';
import { getAllAnswersAction } from 'app/actions';
import generateLicenceQuestions from 'core/fields/pl/generate-licence-number/index';
import { getUserSessionData } from 'core/services/apiService';
import { clearOnlyAnswers } from '../common/clearOnlyAnswers';
import * as session from 'core/models/redis';
import { selectedOrganisationDetails } from 'core/models/apiModel';

export async function getOrderedAnswers(isSuccessPage?: boolean) {
  const selectedOrganisation = (await session.get(
    'selectedOrganisation',
  )) as selectedOrganisationDetails;
  const company = selectedOrganisation?.name;
  const answers = (await getAllAnswersAction()) as AnswersType[];
  const filteredAnswers = isSuccessPage
    ? [
        {
          question: 'Company',
          sectionName: '',
          answers: [
            {
              identifier: 'Company',
              answer: company,
              label: '',
              route: '',
              showChangeLinkInSummary: false,
            },
          ],
          nextRoute: '',
          identifier: 'Company',
        },
        ...answers
          .filter(
            item =>
              Array.isArray(item.answers) &&
              item.answers.length > 0 &&
              item.identifier !== 'how-many-licence-numbers-do-you-require',
          )
          .map(item => ({
            ...item, // Spread the item properties
            answers: item.answers.map(element => ({
              ...element, // Spread the element properties
              showChangeLinkInSummary: element.showChangeLinkInSummary ?? false, // Default to 'no' if undefined
            })),
          })),
      ]
    : answers.filter(
        item => Array.isArray(item.answers) && item.answers.length > 0,
      );
  // answers.map(a => sortAnswerFields(a));
  return filteredAnswers.sort(sortAnswers);
}
function sortAnswers(a: AnswersType, b: AnswersType) {
  return (
    generateLicenceQuestions.map(q => q.question).indexOf(a.question) -
    generateLicenceQuestions.map(q => q.question).indexOf(b.question)
  );
}
export default async function PLLicenceNumberSummary({
  title,
  isSuccessPage,
}: {
  title?: string;
  isSuccessPage?: boolean;
}) {
  const answers = await getOrderedAnswers(isSuccessPage);
  if (answers.length > 1) {
    await session.set('LicenceNumbers', answers);
  }
  const newAnswers = (await session.get('LicenceNumbers')) as AnswersType[];
  if (isSuccessPage) {
    await clearOnlyAnswers();
  }

  return (
    <Summary
      answers={newAnswers ?? answers}
      formPath={'generate-licence-number'}
      title={title}
    />
  );
}

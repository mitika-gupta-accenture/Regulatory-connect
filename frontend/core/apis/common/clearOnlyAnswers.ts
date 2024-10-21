import { getAllAnswersAction } from 'app/actions';
import { AnswersType } from 'core/components/Summary';
import { clearAnswer } from 'core/models/redis';

export async function clearOnlyAnswers() {
  const answers = (await getAllAnswersAction()) as AnswersType[];
  const clearAnswerPromises = answers
    .filter(item => Array.isArray(item.answers) && item.answers.length > 0)
    .map(item => clearAnswer(item.identifier));

  await Promise.all(clearAnswerPromises);
}

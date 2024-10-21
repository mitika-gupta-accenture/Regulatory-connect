import { QuestionAnswerAnswer, ValidCheck } from '../types';
import { ValidatorOptions } from '../validator';

export function isEqualValidator(
  fieldAnswer: QuestionAnswerAnswer[],
  fieldIdentifier: string,
  questionAnswer: QuestionAnswerAnswer[],
  options: ValidatorOptions,
) {
  const comparatorId = options.isEqualTo;

  const answer = fieldAnswer.find(
    ans => ans.identifier === fieldIdentifier,
  )?.answer;

  const comparator = questionAnswer.find(
    ans => ans.identifier === comparatorId,
  )?.answer;

  if (answer !== comparator) {
    return { valid: false, reason: 'is-equal-to' } as ValidCheck;
  }
  return { valid: true } as ValidCheck;
}

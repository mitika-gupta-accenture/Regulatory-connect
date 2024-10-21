import { QuestionAnswerAnswer, ValidCheck } from '../types';

const reason = 'required';

export function requiredValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  const initialValue: ValidCheck = fieldAnswer.length
    ? { valid: true }
    : { valid: false, reason };
  // file required
  return fieldAnswer.reduce((acc: ValidCheck, curr: QuestionAnswerAnswer) => {
    if (acc.valid) {
      if (typeof curr.answer === 'string') {
        return { valid: !!curr.answer.length && curr.answer !== '', reason };
      }
      if ('size' in curr.answer && curr.answer.size === 0) {
        return { valid: false, reason };
      }
    }
    return acc;
  }, initialValue);
}

import { QuestionAnswerAnswer, ValidCheck } from '../types';

function isValidPhone(s: string) {
  // Empty string validation should be handled by 'required' validator
  if (s === '') {
    return true;
  }

  const regex = /^[\d+\s()-]+$/;

  return regex.test(s);
}

export function phoneValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  const initialValue: ValidCheck = { valid: true };
  return fieldAnswer.reduce((acc: ValidCheck, curr: QuestionAnswerAnswer) => {
    if (acc.valid && typeof curr.answer === 'string') {
      return { valid: isValidPhone(curr.answer), reason: 'phone' };
    }

    return acc;
  }, initialValue);
}

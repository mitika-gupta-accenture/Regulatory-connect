import { QuestionAnswerAnswer, ValidCheck } from '../types';

function isValidEmail(s: string) {
  // Empty string validation should be handled by 'required' validator
  if (s === '') {
    return true;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(s);
}

export function emailValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  const initialValue: ValidCheck = { valid: true };
  return fieldAnswer.reduce((acc: ValidCheck, curr: QuestionAnswerAnswer) => {
    if (acc.valid && typeof curr.answer === 'string') {
      return { valid: isValidEmail(curr.answer), reason: 'email' };
    }

    return acc;
  }, initialValue);
}

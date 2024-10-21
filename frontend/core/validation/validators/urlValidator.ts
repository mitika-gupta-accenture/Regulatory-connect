import { QuestionAnswerAnswer, ValidCheck } from '../types';

function isValidURL(s: string) {
  // Empty string validation should be handled by 'required' validator
  if (s === '') {
    return true;
  }

  const regex =
    /^([hH][tT]{2}[pP][sS]?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;
  return regex.test(s);
}

export function urlValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  const initialValue: ValidCheck = { valid: true };
  return fieldAnswer.reduce((acc: ValidCheck, curr: QuestionAnswerAnswer) => {
    if (acc.valid && typeof curr.answer === 'string') {
      return { valid: isValidURL(curr.answer), reason: 'url-malformed' };
    }

    return acc;
  }, initialValue);
}

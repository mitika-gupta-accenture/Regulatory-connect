import { QuestionAnswerAnswer, ValidCheck } from '../types';

function isValidInput(s: number, min?: number, max?: number) {
  // Empty string validation should be handled by 'required' validator
  if (isNaN(s)) {
    return true;
  }
  const isValid =
    (min === undefined || s >= min) && (max === undefined || s <= max);
  return isValid;
}

function isValidNumber(input: string) {
  const number = Number(input);

  if (!isNaN(number) && isFinite(number) && input.length <= 2) {
    return true;
  }
  return false;
}

interface ValidatorOptions {
  min?: number;
  max?: number;
}

export function minMaxValidator(
  fieldAnswer: QuestionAnswerAnswer[],
  options: ValidatorOptions = {},
) {
  const { min, max } = options;
  const initialValue: ValidCheck = { valid: true };

  return fieldAnswer.reduce((acc: ValidCheck, curr: QuestionAnswerAnswer) => {
    if (acc.valid && typeof curr.answer === 'string') {
      return {
        valid:
          isValidInput(parseInt(curr.answer), min, max) &&
          isValidNumber(curr.answer),
        reason: 'min-max-input',
      };
    }

    return acc;
  }, initialValue);
}

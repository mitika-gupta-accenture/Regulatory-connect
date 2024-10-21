import { QuestionAnswerAnswer, ValidCheck } from '../types';

export function fileSizeValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  let validCheck: ValidCheck = { valid: true };

  const fileEmpty = fieldAnswer.some(
    field =>
      typeof field.answer !== 'string' &&
      'size' in field.answer &&
      field.answer?.size > 5 * 1000000,
  );
  if (fileEmpty) {
    validCheck = { valid: !fileEmpty, reason: 'too-big' };
  }

  return validCheck;
}

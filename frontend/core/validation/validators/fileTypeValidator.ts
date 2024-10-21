import { QuestionAnswerAnswer, ValidCheck } from '../types';

export function fileTypeValidator(fieldAnswer: QuestionAnswerAnswer[]) {
  let validCheck: ValidCheck = { valid: true };

  const validFileTypes = [
    'image/png',
    'image/x-png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/tiff',
    'image/jpeg',
  ];
  const invalidFileType = fieldAnswer.some(field => {
    return (
      typeof field.answer !== 'string' &&
      'type' in field.answer &&
      !validFileTypes.includes(field.answer?.type) &&
      field.answer.size > 0
    );
  });

  if (invalidFileType) {
    validCheck = { valid: !invalidFileType, reason: 'invalid-type' };
  } else {
    validCheck = { valid: true };
  }
  return validCheck;
}

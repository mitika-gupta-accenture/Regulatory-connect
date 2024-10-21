import { Field, Question, QuestionAnswer } from '../validation/types';

export function isFileUploadQuestion(question: Question) {
  return question.fields.some(fieldHasFileUpload);
}

function fieldHasFileUpload(field: Field): boolean {
  return (
    field.type === 'file' ||
    (!!field.fields && field.fields.some(fieldHasFileUpload)) ||
    (!!field.answers &&
      field.answers.some(a => !!a.fields && a.fields.some(fieldHasFileUpload)))
  );
}

type ShouldHaveFilesFunc = (fields: Field[], answer: QuestionAnswer) => boolean;

export function shouldHaveFiles(answer: QuestionAnswer, question: Question) {
  const innerShouldHaveFiles: ShouldHaveFilesFunc = (
    fields: Field[],
    answer: QuestionAnswer,
  ) => {
    const hasFileField = fields?.some(f => f.type === 'file');
    if (hasFileField) return true;

    let ix = 0;
    let innerFields: Field[] = [];
    while (ix < fields.length && innerFields.length === 0) {
      const f = fields[ix];
      const matchingAnswer = answer?.answers?.find(
        a => a.identifier === f.identifier,
      );
      if (matchingAnswer) {
        innerFields =
          f.answers?.find(a => a.value === matchingAnswer?.answer)?.fields ||
          [];
      }
      ix += 1;
    }

    return innerFields.length > 0 && innerShouldHaveFiles(innerFields, answer);
  };

  const hasFileAnswer = answer?.answers?.some(
    a => a.answer && typeof a.answer === 'object' && 'size' in a.answer,
  );

  return hasFileAnswer || innerShouldHaveFiles(question.fields, answer);
}

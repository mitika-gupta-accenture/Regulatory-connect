import {
  QuestionAnswerAnswer,
  Question,
  QuestionAnswer,
  ValidCheck,
  Field,
} from './types';
import {
  requiredValidator,
  fileSizeValidator,
  fileTypeValidator,
  urlValidator,
  emailValidator,
  phoneValidator,
  minMaxValidator,
  isEqualValidator,
} from './validators';
import dateValidator from './validators/dateValidator';

export interface ValidatorOptions {
  min?: number;
  max?: number;
  isEqualTo?: string;
}

function getValidatorFunc(
  validatorKey: string,
  identifier?: string,
  allAnswers?: QuestionAnswer,
  options: ValidatorOptions = {},
) {
  switch (validatorKey) {
    case 'required':
      return requiredValidator;
    case 'too-big':
      return fileSizeValidator;
    case 'invalid-type':
      return fileTypeValidator;
    case 'url-malformed':
      return urlValidator;
    case 'email':
      return emailValidator;
    case 'phone':
      return phoneValidator;
    case 'date':
      return dateValidator;
    case 'min-max-input':
      return (fieldAnswer: QuestionAnswerAnswer[]) =>
        minMaxValidator(fieldAnswer, options);
    case 'is-equal-to':
      return (
        fieldAnswer: QuestionAnswerAnswer[],
        fieldIdentifier: string,
        answers: QuestionAnswerAnswer[],
      ) => isEqualValidator(fieldAnswer, fieldIdentifier, answers, options);
    default:
      return () => {
        const validCheck: ValidCheck = { valid: true };
        return validCheck;
      };
  }
}

export function validate(
  currentQuestion: Question,
  questionAnswersObject: QuestionAnswer,
) {
  const validationErrors: unknown[] = [];
  const nestedValidationErrors: unknown[] = [];
  const hasFieldsInQuestion = 'fields' in currentQuestion;

  if (hasFieldsInQuestion) {
    return currentQuestion.fields
      .map(field => {
        let validCheck: ValidCheck = { valid: true };
        let fieldAnswer: QuestionAnswerAnswer[];
        const hasValidationProps =
          'identifier' in field && 'validations' in field;

        const ans = questionAnswersObject.answers.filter(
          answer => answer.identifier === field.identifier,
        );

        if (hasValidationProps) {
          field.validations
            ?.flatMap(v => {
              const keys = Object.keys(v);
              return keys.map(k => ({
                key: k,
                value: v[k],
                validator: getValidatorFunc(k, undefined, undefined, {
                  min: field?.min,
                  max: field?.max,
                  isEqualTo: field?.isEqualTo,
                }),
              }));
            })
            ?.forEach(v => {
              fieldAnswer = questionAnswersObject.answers.filter(
                answer => answer.identifier === field.identifier,
              );
              validCheck = v.validator(
                fieldAnswer,
                field.identifier!,
                questionAnswersObject.answers,
              );

              if (
                field.type === 'select' ||
                field.type === 'autocomplete' ||
                field.type === 'text' ||
                field?.['name'] === 'day' ||
                field?.['name'] === 'month' ||
                field?.['name'] === 'year' ||
                field.type === 'textarea'
              ) {
                if (!validCheck.valid) {
                  validationErrors.push({
                    message: v.value,
                    linkId: `#${field.identifier}-error`,
                    isFileValidation: false,
                    reason: validCheck.reason,
                  });
                } else {
                  validationErrors.filter(
                    (error: any) =>
                      error.linkId !== `#${field.identifier}-error`,
                  );
                }
              } else if (!validCheck.valid) {
                validationErrors.push({
                  message: v.value,
                  linkId: `#${field.identifier}-fieldset`,
                  isFileValidation: field.type === 'file',
                  reason: validCheck.reason,
                });
              }
            });
        }

        const isValid =
          field?.hideChildrenOnSelect && ans
            ? field?.hideChildrenOnSelect !== ans?.[0]?.answer
            : validCheck.valid;

        if (isValid) {
          // checks if fields exist within the current field - for 'Details' component
          const hasFields = field?.fields;
          const hasAnswers = field?.answers;

          if (hasFields) {
            nestedValidationErrors.push(
              validate(
                {
                  fields: field.fields!,
                  'question-identifier': currentQuestion.identifier,
                  identifier: field.identifier || '',
                },
                questionAnswersObject,
              ),
            );

            // checks if answers exist within field - for 'Radio' and 'Checkbox' components
          } else if (hasAnswers) {
            const fields: Field[] = (field.answers || [])
              .filter(answer => 'fields' in answer)
              .filter(answer =>
                fieldAnswer
                  ?.filter(fieldA => fieldA.answer === answer.value)
                  ?.map(fieldA => fieldA.answer)
                  ?.includes(answer.value),
              )
              ?.flatMap(x => x.fields || []);

            if (fields.length) {
              nestedValidationErrors.push(
                validate(
                  {
                    fields: fields || [],
                    'question-identifier': currentQuestion.identifier,
                    identifier: field.identifier || '',
                  },
                  questionAnswersObject,
                ),
              );
            }
          }
        }

        return [...validationErrors, ...nestedValidationErrors];
      })
      .flat(Infinity);
  }
}

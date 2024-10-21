import { QuestionAnswer, QuestionAnswerAnswer, ValidCheck } from "../types";

function validateDate(inputDate: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const [year, month, day] = inputDate.split('-').map(Number);

  // Validate year
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    errors.push("year");
  }

  // Validate month
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    errors.push("month");
  }

  // Validate day
  if (!Number.isInteger(day) || day < 1 || day > new Date(year, month, 0).getDate()) {
    errors.push("day");
  }

  return { isValid: errors.length === 0, errors };
}


function dateValidator(fieldAnswer: QuestionAnswerAnswer[], dateIdentifier: string | undefined, allAnswers: QuestionAnswerAnswer[]): ValidCheck {
  if (!['day', 'month', 'year'].some((suffix) => dateIdentifier?.endsWith(suffix))) {
    return { valid: true };
  }

  const dateBaseIdentifier = dateIdentifier?.split('--')[0];

  const day = allAnswers.find(ans => ans.identifier === `${dateBaseIdentifier}--day`)?.answer?.toString();
  const month = allAnswers.find(ans => ans.identifier === `${dateBaseIdentifier}--month`)?.answer?.toString();
  const year = allAnswers.find(ans => ans.identifier === `${dateBaseIdentifier}--year`)?.answer?.toString();

  if (!(day && month && year)) {
    return { valid: true };
  }

  const { isValid, errors } = validateDate(`${year}-${month}-${day}`);

  if (isValid) {
    return { valid: true };
  }

  const errorReasons: { [key: string]: string } = {
    day: 'Invalid day',
    month: 'Invalid month',
    year: 'Invalid year',
  };

  for (const error of errors) {
    if (dateIdentifier?.endsWith(error)) {
      return { valid: false, reason: errorReasons[error] };
    }
  }

  return { valid: true };
}

export default dateValidator;
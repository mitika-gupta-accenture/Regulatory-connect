import { SingleInputType, MultipleInputType } from '../components/FieldFactory';
import { ErrorSummaryType, ErrorType } from '../components/ErrorSummary';
import { DateInputsType } from 'core/components/DateInput';

export default function FindErrorMessage(
  errorSummary: ErrorSummaryType,
  field: SingleInputType | MultipleInputType | DateInputsType,
) {
  const error = errorSummary?.errors?.find((err: ErrorType) =>
    err.linkId.includes(field.identifier),
  );

  // Extract the message if an error is found
  const errMsg = error?.message;
  return errMsg || '';
}

export function FindErrorMessageInCollection(
  errorSummary: ErrorSummaryType,
  field: MultipleInputType,
) {
  return errorSummary?.errors?.find((err: ErrorType) => {
    return field?.answers
      ?.map(answer => answer.value)
      .some(v => err.linkId.includes(v));
  })?.message;
}

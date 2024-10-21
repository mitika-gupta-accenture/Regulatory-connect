import { emailValidator } from 'core/validation/validators';

export interface FormData {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface ValidateReturnType {
  key: string;
  message: string;
}

export function validateFormData(formData: FormData): ValidateReturnType[] {
  const errorMessages = [] as ValidateReturnType[];
  const letterAndNumberRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])|^[a-zA-Z]+$/;
  const symbolRegex = /[^a-zA-Z0-9]/;

  if (!formData.firstName) {
    errorMessages.push({ key: 'first name', message: 'Enter your first name' });
  } else if (symbolRegex.test(formData.firstName)) {
    errorMessages.push({
      key: 'first name',
      message: 'First name must not contain symbols',
    });
  } else if (!letterAndNumberRegex.test(formData.firstName)) {
    errorMessages.push({
      key: 'first name',
      message:
        'First name must contain at least one letter and cannot be only numbers',
    });
  }

  if (!formData.lastName) {
    errorMessages.push({ key: 'last name', message: 'Enter your last name' });
  } else if (symbolRegex.test(formData.lastName)) {
    errorMessages.push({
      key: 'last name',
      message: 'Last name must not contain symbols',
    });
  } else if (!letterAndNumberRegex.test(formData.lastName)) {
    errorMessages.push({
      key: 'last name',
      message:
        'Last name must contain at least one letter and cannot be only numbers',
    });
  }

  if (!formData.email) {
    errorMessages.push({
      key: 'email',
      message: 'Enter your email address',
    });
  } else if (
    !emailValidator([{ identifier: 'email', answer: formData.email }]).valid
  ) {
    errorMessages.push({
      key: 'email',
      message: 'Enter a valid email address',
    });
  }

  return errorMessages;
}

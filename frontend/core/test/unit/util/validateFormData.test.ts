import { validateFormData, FormData } from '../../../util/validateFormData'; 

describe('validateFormData', () => {
  it('should return an error if first name is empty', () => {
    const formData: FormData = { firstName: '', lastName: 'Doe', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'first name', message: 'Enter your first name' }]);
  });

  it('should return an error if first name contains symbols', () => {
    const formData: FormData = { firstName: 'John@', lastName: 'Doe', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'first name', message: 'First name must not contain symbols' }]);
  });

  it('should return an error if first name contains only numbers', () => {
    const formData: FormData = { firstName: '1234', lastName: 'Doe', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'first name', message: 'First name must contain at least one letter and cannot be only numbers' }]);
  });

  it('should return an error if last name is empty', () => {
    const formData: FormData = { firstName: 'John', lastName: '', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'last name', message: 'Enter your last name' }]);
  });

  it('should return an error if last name contains symbols', () => {
    const formData: FormData = { firstName: 'John', lastName: 'Doe@', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'last name', message: 'Last name must not contain symbols' }]);
  });

  it('should return an error if last name contains only numbers', () => {
    const formData: FormData = { firstName: 'John', lastName: '1234', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'last name', message: 'Last name must contain at least one letter and cannot be only numbers' }]);
  });

  it('should return an error if email is empty', () => {
    const formData: FormData = { firstName: 'John', lastName: 'Doe', email: '' };
    const result = validateFormData(formData);
    expect(result).toEqual([{ key: 'email', message: 'Enter your email address' }]);
  });

  test('should return an error when email is invalid', () => {
    const formData: FormData = { firstName: 'John', lastName: 'Doe', email: 'invalid-email' };
    const errors = validateFormData(formData);
    expect(errors).toEqual([{ key: 'email', message: 'Enter a valid email address' }]);
  });

  it('should return no errors for valid input', () => {
    const formData: FormData = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
    const result = validateFormData(formData);
    expect(result).toEqual([]);
  });
});

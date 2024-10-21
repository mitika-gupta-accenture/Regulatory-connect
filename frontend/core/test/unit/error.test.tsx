import { ErrorSummaryType } from 'core/components/ErrorSummary';
import {
  SingleInputType,
  MultipleInputType,
} from 'core/components/FieldFactory';
import FindErrorMessage, {
  FindErrorMessageInCollection,
} from 'core/util/Errors';

describe('Error Message Finder Functions', () => {
  describe('FindErrorMessage', () => {
    const errorSummary: ErrorSummaryType = {
      errors: [
        { linkId: '#field1', message: 'Error in field 1' },
        { linkId: '#field2', message: 'Error in field 2' },
      ],
      title: '',
    };

    test('should return the correct error message for SingleInputType', () => {
      const field: SingleInputType = {
        identifier: 'field1',
        type: 'text',
        label: 'Field 1',
        prefix: false,
        prefixValue: '',
        suffix: false,
        suffixValue: '',
        id: 'field1',
      };
      const errorMessage = FindErrorMessage(errorSummary, field);
      expect(errorMessage).toBe('Error in field 1');
    });

    test('should return an empty string if no matching error is found', () => {
      const field: SingleInputType = {
        identifier: 'field3',
        type: 'text',
        label: 'Field 3',
        prefix: false,
        prefixValue: '',
        suffix: false,
        suffixValue: '',
        id: 'field3',
      };
      const errorMessage = FindErrorMessage(errorSummary, field);
      expect(errorMessage).toBe(''); // Changed from toBeUndefined() to toBe('')
    });
  });

  describe('FindErrorMessageInCollection', () => {
    const errorSummary: ErrorSummaryType = {
      errors: [
        { linkId: '#field1', message: 'Error in field 1' },
        { linkId: '#field2', message: 'Error in field 2' },
      ],
      title: '',
    };

    test('should return the correct error message for MultipleInputType', () => {
      const field: MultipleInputType = {
        type: 'checkbox',
        identifier: 'checkboxGroup',
        name: 'myCheckboxGroup',
        id: 'field1',
        answers: [{ value: 'field1' }, { value: 'field3' }],
        options: [
          { label: 'Option 1', value: 'field1' },
          { label: 'Option 2', value: 'field2' },
        ],
      };
      const errorMessage = FindErrorMessageInCollection(errorSummary, field);
      expect(errorMessage).toBe('Error in field 1');
    });

    test('should return undefined if no matching error is found in collection', () => {
      const field: MultipleInputType = {
        type: 'checkbox',
        identifier: 'checkboxGroup',
        name: 'myCheckboxGroup',
        id: 'field1',
        answers: [{ value: 'field3' }, { value: 'field4' }],
        options: [
          { label: 'Option 1', value: 'field1' },
          { label: 'Option 2', value: 'field2' },
        ],
      };
      const errorMessage = FindErrorMessageInCollection(errorSummary, field);
      expect(errorMessage).toBeUndefined();
    });

    test('should return undefined if errorSummary has no errors', () => {
      const emptyErrorSummary: ErrorSummaryType = {
        errors: [],
        title: '',
      };
      const field: MultipleInputType = {
        type: 'checkbox',
        identifier: 'checkboxGroup',
        name: 'myCheckboxGroup',
        id: 'field1',
        answers: [{ value: 'field1' }],
        options: [
          { label: 'Option 1', value: 'field1' },
          { label: 'Option 2', value: 'field2' },
        ],
      };
      const errorMessage = FindErrorMessageInCollection(
        emptyErrorSummary,
        field,
      );
      expect(errorMessage).toBeUndefined();
    });
  });
});

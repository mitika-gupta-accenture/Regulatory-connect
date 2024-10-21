import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox, { CheckboxFieldType } from '../../../components/Checkbox';
import { ErrorSummaryType } from '../../../components/ErrorSummary';
import { mapApiDataToJson } from '../../../../core/util/mapApiDataToJson';

jest.mock('../../../../core/util/mapApiDataToJson', () => ({
  mapApiDataToJson: jest.fn(),
}));

const mockField: CheckboxFieldType = {
  type: 'checkbox',
  identifier: 'test-checkbox',
  label: 'Test Checkbox',
  hint: 'Select one or more options',
  answers: [
    { value: 'option1', route: '/' },
    { value: 'option2', route: '/' },
    {
      value: 'option3',
      route: '/',
      fields: [
        {
          type: 'text',
          identifier: 'child-field',
          label: 'Child Field',
          id: 'child-field-id',
          prefix: false,
          prefixValue: '',
          suffix: false,
          suffixValue: '',
        },
      ],
    },
  ],
  name: '',
  id: '',
  options: [],
};

const mockErrorSummary: ErrorSummaryType = {
  errors: [],
  title: '',
};

const mockErrorSummaryWithError: ErrorSummaryType = {
  errors: [
    { linkId: 'test-checkbox', message: 'Error message for test-checkbox' },
  ],
  title: 'Error',
};

const mockAllPreviousAnswers = [
  { identifier: 'test-checkbox', answer: 'option1', label: 'testLabel' },
];

describe('Checkbox Wrapper', () => {
  test('renders the Checkbox component', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummary}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByText('Select one or more options')).toBeInTheDocument();
  });

  test('updates state on checkbox change', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummary}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    const option1 = screen.getByLabelText('option1');

    fireEvent.click(option1);
    expect(option1).toBeChecked();

    fireEvent.click(option1);
    expect(option1).not.toBeChecked();
  });

  test('displays error message when there is an error', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummaryWithError}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    // Check for the field-level error message
    expect(
      screen.getByText('Error message for test-checkbox'),
    ).toBeInTheDocument();
    expect(screen.getByText('Error:')).toBeInTheDocument();
  });

  test('renders conditional children fields when a checkbox is selected', () => {
    const mockFieldWithConditionalChildren: CheckboxFieldType = {
      ...mockField,
      answers: [
        {
          value: 'option1',
          route: '/',
          fields: [
            {
              type: 'text',
              identifier: 'child-field',
              label: 'Child Field',
              id: 'child-field-id',
              prefix: false,
              prefixValue: '',
              suffix: false,
              suffixValue: '',
            },
          ],
        },
      ],
    };

    render(
      <Checkbox
        field={mockFieldWithConditionalChildren}
        errorSummary={mockErrorSummary}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    const option1 = screen.getByLabelText('option1');
    fireEvent.click(option1);

    expect(screen.getByLabelText('Child Field')).toBeInTheDocument();
  });

  test('initializes with previous answers', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummary}
        previousAnswer="option1"
        allPreviousAnswers={mockAllPreviousAnswers}
      />,
    );

    expect(screen.getByLabelText('option1')).toBeChecked();
  });

  test('handles no previous answers gracefully', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummary}
        previousAnswer=""
        allPreviousAnswers={undefined}
      />,
    );

    const option1 = screen.getByLabelText('option1');
    expect(option1).not.toBeChecked();
  });

  // Additional Test Cases
  test('should handle apiDataKey and update answers accordingly', () => {
    const mockFieldWithApiDataKey: CheckboxFieldType = {
      ...mockField,
      apiDataKey: 'key1',
    };

    const mockApiData = {
      key1: [
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
      ],
    };

    (mapApiDataToJson as jest.Mock).mockReturnValue(mockApiData.key1);

    render(
      <Checkbox
        field={mockFieldWithApiDataKey}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    expect(mapApiDataToJson).toHaveBeenCalledWith(
      mockFieldWithApiDataKey,
      mockApiData.key1,
    );
    expect(screen.getByLabelText('Option 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 5')).toBeInTheDocument();
  });

  test('should retain existing answers if mapApiDataToJson returns undefined', () => {
    const mockFieldWithApiDataKey: CheckboxFieldType = {
      ...mockField,
      apiDataKey: 'key1',
    };

    const mockApiData = {
      key1: undefined,
    };

    (mapApiDataToJson as jest.Mock).mockReturnValue(undefined);

    render(
      <Checkbox
        field={mockFieldWithApiDataKey}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    expect(mapApiDataToJson).toHaveBeenCalledWith(
      mockFieldWithApiDataKey,
      mockApiData.key1,
    );
    expect(screen.getByLabelText('option1')).toBeInTheDocument(); // Should retain the existing options
  });

  test('should not break when no apiData is provided', () => {
    render(
      <Checkbox
        field={mockField}
        errorSummary={mockErrorSummary}
        previousAnswer=""
        allPreviousAnswers={[]}
      />,
    );

    const option1 = screen.getByLabelText('option1');
    const option2 = screen.getByLabelText('option2');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});

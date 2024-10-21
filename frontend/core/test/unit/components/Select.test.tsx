import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Select from '../../../components/Select';
import { SelectFieldType } from '../../../components/Select';
import { ApiResponseDataType } from 'core/validation/types';
import { SelectOption } from '@mhra/mhra-design-components/dist/components/select/select.types';

jest.mock('@mhra/mhra-design-components', () => ({
  Select: jest.fn(
    ({
      name,
      label,
      options,
      hint,
      errorMessage,
      defaultValue,
      onSelect,
      className,
    }) => (
      <div>
        <label htmlFor={name}>{label}</label>
        <select
          id={name}
          name={name}
          defaultValue={defaultValue}
          onChange={onSelect}
          className={className}
        >
          {options.map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && <p>{hint}</p>}
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    ),
  ),
}));

const mockField: SelectFieldType = {
  type: 'select',
  identifier: 'testSelect',
  answers: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ],
  label: 'Test Select',
  hint: 'Select an option',
  className: 'test-class',
};

const mockField2: SelectFieldType = {
  type: 'select',
  identifier: 'testSelect',
  answers: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ],
  hint: 'Select an option',
  className: 'test-class',
};

const mockErrorSummary = {
  title: '',
  errors: [{ linkId: 'testSelect', message: 'This field is required' }],
};

describe('Select Component', () => {
  it('renders without crashing and displays label, hint, and options', () => {
    const { getByLabelText, getByText } = render(
      <Select field={mockField} errorSummary={{ title: '', errors: [] }} />,
    );

    expect(getByLabelText(mockField.label || '')).toBeInTheDocument();
    expect(getByText(mockField.hint || '')).toBeInTheDocument();
    mockField.answers.forEach(option => {
      expect(getByText(option.label)).toBeInTheDocument();
    });
  });

  it('renders without crashing', () => {
    const { getByLabelText, getByText } = render(
      <Select field={mockField2} errorSummary={{ title: '', errors: [] }} />,
    );

    expect(getByLabelText('')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const { getByText } = render(
      <Select field={mockField} errorSummary={mockErrorSummary} />,
    );

    expect(getByText(mockErrorSummary.errors[0].message)).toBeInTheDocument();
  });

  it('calls handleChange on selection change', () => {
    const { getByLabelText } = render(
      <Select field={mockField} errorSummary={{ title: '', errors: [] }} />,
    );

    const selectElement = getByLabelText(
      mockField.label || '',
    ) as HTMLSelectElement;
    fireEvent.change(selectElement, { target: { value: '1' } });
    expect(selectElement.value).toBe('1');
  });

  it('renders with the default value from previousAnswer', () => {
    const { getByLabelText } = render(
      <Select
        field={mockField}
        errorSummary={{ title: '', errors: [] }}
        previousAnswer="2"
      />,
    );

    const selectElement = getByLabelText(
      mockField.label || '',
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe('2');
  });

  it('does not display an error message when there is no error', () => {
    const { queryByText } = render(
      <Select field={mockField} errorSummary={{ title: '', errors: [] }} />,
    );

    expect(
      queryByText(mockErrorSummary.errors[0].message),
    ).not.toBeInTheDocument();
  });

  it('does not display an error message when there is no error', () => {
    const mockApiDetails: ApiResponseDataType = {
      productclasstype: [
        { identifier: 'option1', name: 'Option 1' },
        { identifier: 'option2', name: 'Option 2' },
        { identifier: 'option3', name: 'Option 3' },
      ],
    };
    const { queryByText } = render(
      <Select
        field={{
          ...mockField,
          apiDataKey: 'productclasstype',
          answers: [],
          placeHolder: 'Please select one',
        }}
        apiData={mockApiDetails}
        errorSummary={{ title: '', errors: [] }}
      />,
    );

    expect(
      queryByText(mockErrorSummary.errors[0].message),
    ).not.toBeInTheDocument();
  });
});

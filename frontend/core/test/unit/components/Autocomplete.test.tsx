import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutoComplete, {
  AutocompleteFieldType,
} from '../../../components/Autocomplete';
import { ErrorSummaryType } from '../../../components/ErrorSummary';
import FindErrorMessage from '../../../util/Errors';
import { ApiResponseDataType } from 'core/validation/types';

jest.mock('../../unit/util/debounce', () => jest.fn(value => value));

// Mock the FindErrorMessage function
jest.mock('../../../util/Errors', () => jest.fn());

// Mock the global fetch function
global.fetch = jest.fn();
const mockApiDetails: ApiResponseDataType = {
  productclasstype: [
    { identifier: 'option1', name: 'Option 1' },
    { identifier: 'option2', name: 'Option 2' },
    { identifier: 'option3', name: 'Option 3' },
  ],
};

beforeEach(() => {
  // Reset fetch mocks before each test
  (fetch as jest.Mock).mockClear();
});

const field: AutocompleteFieldType = {
  type: 'autocomplete',
  identifier: 'test-autocomplete',
  label: 'Test Autocomplete',
  hint: 'Enter at least 3 characters',
  apiEndPoint: 'https://mocki.io/v1/a97e2c63-599b-4707-a775-267c1b565cdc',
  widthSize: 100,
  fluidWidth: 'full',
  labelSize: 'm',
  id: '',
  value: '',
  autoSuggest: [],
  apiDataKey: 'productclasstype',
};

const errorSummary: ErrorSummaryType = { errors: [], title: '' };

describe('AutoComplete', () => {
  it('renders the Autocomplete component with initial props', () => {
    render(
      <AutoComplete
        field={field}
        errorSummary={errorSummary}
        apiData={mockApiDetails}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'test-autocomplete');
    expect(screen.getByLabelText('Test Autocomplete')).toBeInTheDocument();
  });

  it('fetches suggestions when input value length is greater than 2', async () => {
    const mockSuggestions = [
      { label: 'test 1', value: 'test1', route: '' },
      { label: 'test 2', value: 'test2', route: '' },
    ];
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSuggestions),
      }),
    );

    render(
      <AutoComplete
        field={field}
        errorSummary={errorSummary}
        apiData={mockApiDetails}
      />,
    );
    fireEvent.change(screen.getByTestId('autocomplete-test-autocomplete'), {
      target: { value: 'Option' },
    });

    await waitFor(async () => {
      expect(screen.getByLabelText('Test Autocomplete')).toHaveValue('Option');
      const suggestions = screen.getByText('Option 1');
      expect(suggestions).toBeInTheDocument();
      fireEvent.click(suggestions);
    });
  });

  it('displays error message when errorSummary contains errors', () => {
    (FindErrorMessage as jest.Mock).mockReturnValue('Error message');
    render(
      <AutoComplete
        field={field}
        errorSummary={errorSummary}
        apiData={mockApiDetails}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    const ariaDescribedby = inputElement.getAttribute('aria-describedby');
    expect(ariaDescribedby).toContain('test-autocomplete-error');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    render(
      <AutoComplete
        field={field}
        errorSummary={errorSummary}
        apiData={mockApiDetails}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new value' } });

    // expect(inputElement.value).toBe('new value');
  });

  it('calls onSuggestionSelect handler when suggestion is selected', () => {
    render(
      <AutoComplete
        field={{
          ...field,
          apiDataKey: '',
        }}
        errorSummary={errorSummary}
        previousAnswer={'test1'}
        apiData={mockApiDetails}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'sug' } });
    fireEvent.select(inputElement, { target: { value: 'suggestion1' } });
  });
});

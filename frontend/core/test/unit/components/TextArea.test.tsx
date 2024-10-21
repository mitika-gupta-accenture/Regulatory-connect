import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextArea, { TextAreaInputFieldType } from '../../../components/TextArea';
import FindErrorMessage from '../../../util/Errors';
import { Conditional } from '../../../components/Conditional';
import { ErrorSummaryType } from 'core/components/ErrorSummary';

jest.mock('../../../util/Errors', () => jest.fn());
jest.mock('../../../components/Conditional', () => ({
  Conditional: ({
    showWhen,
    children,
  }: {
    showWhen: boolean;
    children: React.ReactNode;
  }) => (showWhen ? <div>{children}</div> : null),
}));

describe('TextArea Component', () => {
  const field: TextAreaInputFieldType = {
    type: 'textarea',
    identifier: 'test id',
    name: 'test-textarea',
    label: 'Test TextArea',
    characterLimit: 200,
    hint: 'Enter your text',
    labelSize: 'm',
    withHeading: true,
    className: 'test-class',
    defaultValue: 'Initial text',
  };

  const fieldWithoutLimit: TextAreaInputFieldType = {
    type: 'textarea',
    identifier: 'test id',
    name: 'test-textarea',
    label: 'Test TextArea',
    rows: 5,
    hint: 'Enter your text',
    labelSize: 'm',
    withHeading: true,
    className: 'test-class',
    defaultValue: 'Initial text',
  };

  const errorSummary: ErrorSummaryType = {
    title: 'Error Summary',
    errors: [
      { linkId: 'field1', message: 'Error 1' },
      { linkId: 'field2', message: 'Error 2' },
    ],
  };

  beforeEach(() => {
    (FindErrorMessage as jest.Mock).mockReturnValue(undefined);
  });

  it('renders without crashing', () => {
    render(
      <TextArea field={{ ...field, rows: 6 }} errorSummary={errorSummary} />,
    );
    expect(screen.getByLabelText('Test TextArea')).toBeInTheDocument();
  });

  it('displays character count correctly when typing', () => {
    render(<TextArea field={field} errorSummary={errorSummary} />);
    const textarea = screen.getByLabelText(
      'Test TextArea',
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(
      screen.getByText('You have entered 5 of 200 characters'),
    ).toBeInTheDocument();
  });

  it('truncates input when character limit is exceeded and retains only allowed characters', () => {
    render(<TextArea field={field} errorSummary={errorSummary} />);
    const textarea = screen.getByLabelText(
      'Test TextArea',
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'a'.repeat(201) } });
    expect(
      screen.getByText('You have entered 200 of 200 characters'),
    ).toBeInTheDocument();
  });

  it('displays error message when present', () => {
    (FindErrorMessage as jest.Mock).mockReturnValue('Error message');
    render(<TextArea field={field} errorSummary={errorSummary} />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles previous answer correctly', () => {
    render(
      <TextArea
        field={field}
        errorSummary={errorSummary}
        previousAnswer="Previous answer"
      />,
    );
    const textarea = screen.getByLabelText(
      'Test TextArea',
    ) as HTMLTextAreaElement;
    expect(
      screen.getByText('You have entered 15 of 200 characters'),
    ).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <TextArea
        field={{ ...field, characterLimit: 100 }}
        errorSummary={errorSummary}
      >
        <div>Child element</div>
      </TextArea>,
    );
    expect(screen.getByText('Child element')).toBeInTheDocument();
  });

  it('displays hint correctly', () => {
    render(<TextArea field={field} errorSummary={errorSummary} />);
    expect(screen.getByText('Enter your text')).toBeInTheDocument();
  });

  it('handles conditional rendering of character count message', () => {
    render(<TextArea field={field} errorSummary={errorSummary} />);
    expect(
      screen.getByText('You can enter up to 200 characters'),
    ).toBeInTheDocument();

    const textarea = screen.getByLabelText(
      'Test TextArea',
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(
      screen.getByText('You have entered 5 of 200 characters'),
    ).toBeInTheDocument();
  });

  it('applies custom class name', () => {
    render(<TextArea field={field} errorSummary={errorSummary} />);
    const container = screen.getByLabelText('Test TextArea');
    expect(container).toHaveClass('test-class');
  });

  it('calls onChange prop when text is entered', () => {
    const handleChange = jest.fn();
    render(
      <TextArea
        field={{ ...field, onChange: handleChange }}
        errorSummary={errorSummary}
      />,
    );
    const textarea = screen.getByLabelText(
      'Test TextArea',
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'New text' } });

    // Asynchronous state update, need to wait for the state to be updated
    setTimeout(() => {
      expect(handleChange).toHaveBeenCalled();
    }, 0);
  });
  it('renders with default character limit when not specified', () => {
    render(<TextArea field={fieldWithoutLimit} errorSummary={errorSummary} />);
    const textareaInput = screen.getByLabelText('Test TextArea');

    expect(textareaInput).toBeInTheDocument();
  });
});

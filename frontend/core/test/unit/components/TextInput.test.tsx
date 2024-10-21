import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput, { TextInputFieldType } from 'core/components/TextInput';
import { ErrorSummaryType } from "../../../components/ErrorSummary";
import FindErrorMessage from "../../../util/Errors";
import { Input } from '@mhra/mhra-design-components';

jest.mock('../../../util/Errors');
jest.mock('@mhra/mhra-design-components', () => ({
  Input: jest.fn(() => <div data-testid="input-component" />),
}));

describe('TextInput Component', () => {
  const field: TextInputFieldType = {
    type: 'text',
    identifier: 'test-id',
    defaultValue: '',
    label: 'Test Label',
    labelSize: 'm',
    isLabelWrappedInHeading: false,
    hint: 'Test Hint',
    size: 20,
    disabled: false,
    autocomplete: 'off',
    className: 'test-class',
    extraLetterSpacing: true,
    prefix: true,
    prefixValue: '£',
    suffix: true,
    suffixValue: '.00',
    pattern: '[0-9]*',
    fluidWidth: 'full',
    inputMode: 'numeric',
    id: ''
  };

  const errorSummary: ErrorSummaryType = {
    errors: [],
    title: ''
  };

  beforeEach(() => {
    (FindErrorMessage as jest.Mock).mockReturnValue('');
    (Input as jest.Mock).mockClear(); 
  });

  it('should render without crashing', () => {
    render(<TextInput field={field} errorSummary={errorSummary} />);
    expect(screen.getByTestId('input-component')).toBeInTheDocument();
  });

  it('should pass the correct props to the Input component', () => {
    render(<TextInput field={field} errorSummary={errorSummary} />);
    
    expect(Input).toHaveBeenCalledTimes(1); 

    const inputProps = (Input as jest.Mock).mock.calls[0][0];
    
    expect(inputProps).toEqual(expect.objectContaining({
      id: field.identifier,
      name: field.identifier,
      hint: field.hint,
      label: field.label,
      labelSize: field.labelSize,
      isLabelWrappedInHeading: field.isLabelWrappedInHeading,
      errorMessage: '',
      size: field.size,
      disabled: field.disabled,
      autocomplete: field.autocomplete,
      defaultValue: '', 
      className: field.className,
      extraLetterSpacing: field.extraLetterSpacing,
      prefix: field.prefix,
      prefixValue: field.prefixValue,
      suffix: field.suffix,
      suffixValue: field.suffixValue,
      pattern: field.pattern,
      fluidWidth: field.fluidWidth,
      inputMode: field.inputMode,
    }));
  });

  it('should display children if provided', () => {
    render(
      <TextInput field={field} errorSummary={errorSummary}>
        <div data-testid="child-component">Child Component</div>
      </TextInput>
    );
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('should use previousAnswer if provided', () => {
    render(<TextInput field={field} errorSummary={errorSummary} previousAnswer="Previous Answer" />);
    
    expect(Input).toHaveBeenCalledTimes(1); 
    const inputProps = (Input as jest.Mock).mock.calls[0][0];
    
    expect(inputProps.defaultValue).toBe('Previous Answer');
  });

  it('should find and display the error message', () => {
    (FindErrorMessage as jest.Mock).mockReturnValue('Test Error Message');
    render(<TextInput field={field} errorSummary={errorSummary} />);
    
    expect(Input).toHaveBeenCalledTimes(1); 

    const inputProps = (Input as jest.Mock).mock.calls[0][0];
    
    expect(inputProps.errorMessage).toBe('Test Error Message');
  });
});
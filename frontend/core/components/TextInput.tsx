'use client';

import React from 'react';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import FindErrorMessage from '../util/Errors';
import { Input } from '@mhra/mhra-design-components';
import { InputProps } from '@mhra/mhra-design-components/dist/components/input/input.types';

export interface TextInputFieldType extends InputProps {
  type: 'text';
  identifier: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  parentIndex?: number;
  inputType?: 'number' | 'text';
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
  ariaLabel?: string;
}

function TextInput({
  field,
  errorSummary,
  previousAnswer,
  children,
}: {
  field: TextInputFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  children?: React.ReactNode;
}) {
  const errMsg = FindErrorMessage(errorSummary, field);

  return (
    <>
      <Input
        id={field.identifier}
        name={field.identifier}
        hint={field?.hint}
        label={field.label}
        ariaLabel={field.ariaLabel}
        labelSize={field.labelSize}
        isLabelWrappedInHeading={field.isLabelWrappedInHeading}
        errorMessage={errMsg}
        size={field.size}
        disabled={field.disabled}
        autocomplete={field.autocomplete}
        defaultValue={previousAnswer || field.defaultValue}
        className={field.className}
        extraLetterSpacing={field.extraLetterSpacing}
        prefix={field.prefix}
        prefixValue={field.prefixValue}
        suffix={field.suffix}
        suffixValue={field.suffixValue}
        pattern={field.pattern}
        fluidWidth={field.fluidWidth}
        inputMode={field.inputMode}
        type={field.inputType ?? 'text'}
      />
      {children}
    </>
  );
}

export default TextInput;

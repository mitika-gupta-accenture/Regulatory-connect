'use client';

import React, { ReactNode, useState } from 'react';
import { Conditional } from './Conditional';
import { ErrorSummaryType } from './ErrorSummary';
import FindErrorMessage from '../util/Errors';
import { TextArea as TextAreaInput } from '@mhra/mhra-design-components';
import { TextAreaComponentProps } from '@mhra/mhra-design-components/dist/components/textarea/textarea.types';

export interface TextAreaInputFieldType extends TextAreaComponentProps {
  type: 'textarea';
  identifier: string;
  parentIndex?: number;
  exampleAnswer?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

function TextArea({
  field,
  errorSummary,
  previousAnswer,
  children,
}: {
  field: TextAreaInputFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  children?: ReactNode;
}) {
  const errorMessage = FindErrorMessage(errorSummary, field);
  const [charCount, setCharCount] = useState(
    previousAnswer ? previousAnswer.length : 0,
  );

  const { characterLimit = 200 } = field;
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (characterLimit && inputValue.length <= characterLimit) {
      setCharCount(inputValue.length);
    } else if (characterLimit) {
      // Truncate the input value
      event.target.value = inputValue.substring(0, characterLimit);
      setCharCount(characterLimit);
    }
  };

  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength={characterLimit}
    >
      <TextAreaInput
        name={field.identifier}
        label={field.label}
        rows={field?.rows || 5}
        hint={field?.hint}
        errorMessage={errorMessage}
        labelSize={field?.labelSize}
        withHeading={field?.withHeading}
        characterLimit={field?.characterLimit || 200}
        defaultValue={previousAnswer}
        onChange={handleInput}
        className={field.className}
      />
      {children}
      <div
        id={`with-hint-info-${field.label}`}
        className="govuk-hint govuk-character-count__message"
      >
        <Conditional showWhen={!!charCount}>
          You have entered {charCount} of {characterLimit} characters
        </Conditional>
        <Conditional showWhen={!charCount}>
          You can enter up to {characterLimit} characters
        </Conditional>
      </div>
    </div>
  );
}

export default TextArea;

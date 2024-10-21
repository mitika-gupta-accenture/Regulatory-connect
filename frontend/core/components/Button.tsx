'use client';

import React from 'react';
import { Button as ButtonLib } from '@mhra/mhra-design-components';
import { ButtonProps } from '@mhra/mhra-design-components/dist/components/button/button.types';

interface CustomButtonType extends ButtonProps {
  text: string;
}

function Button({
  text,
  name,
  href,
  disabled = false,
  isStartButton = false,
  className,
  id,
  buttonType,
}: CustomButtonType) {
  return (
    <ButtonLib
      name={name}
      text={text}
      href={href}
      id={id}
      disabled={disabled}
      className={className}
      data-cy="govuk-button"
      isStartButton={isStartButton}
      buttonType={buttonType}
    />
  );
}

export default Button;

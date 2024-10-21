'use client';

import React from 'react';
import { Heading as HeadingLib } from '@mhra/mhra-design-components';
import FieldFactory from './FieldFactory';
import { ErrorSummaryType, ErrorType } from './ErrorSummary';
import { HeadingComponentProps } from '@mhra/mhra-design-components/dist/components/heading/heading.types';
import { refDataString } from 'core/util/stringModifier';

export interface HeadingFieldType extends HeadingComponentProps {
  type: 'heading';
  identifier: string;
  fields?: any[];
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

interface HeadingProps {
  field: HeadingFieldType;
  previousAnswer?: string;
  errorSummary: ErrorSummaryType;
  apiData?: Object;
}

const Heading: React.FC<HeadingProps> = ({
  field,
  errorSummary,
  apiData,
}) => {
  const children = field?.fields?.map((childField: any, index: any) => (
    <FieldFactory key={index} field={childField} errorSummary={errorSummary} />
  ));

  const headingText =
    apiData && field.apiDataKey && field.text
      ? refDataString(field.text, field?.apiDataKey, apiData)
      : field.text;

  return (
    <HeadingLib
      text={headingText}
      level={field.level}
      size={field.size}
      id={field.identifier}
      className={field.className}
    >
      {children}
    </HeadingLib>
  );
};

export default Heading;

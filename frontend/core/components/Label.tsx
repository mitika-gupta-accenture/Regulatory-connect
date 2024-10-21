'use client';

import React from 'react';
import { Label as LabelLib } from '@mhra/mhra-design-components';
import FieldFactory, { FieldType } from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';
import { LabelComponentProps } from '@mhra/mhra-design-components/dist/components/label/label.types';
import { refDataString } from '../util/stringModifier';

export interface LabelFieldType extends LabelComponentProps {
  type: 'label';
  identifier: string;
  fields?: FieldType[];
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

interface LabelProps {
  field: LabelFieldType;
  errorSummary: ErrorSummaryType;
  apiData?: Object;
}

const Label: React.FC<LabelProps> = ({ field, errorSummary, apiData }) => {
  const children = field.fields?.map((childField, index) => (
    <FieldFactory key={index} field={childField} errorSummary={errorSummary} />
  ));

  const str =
    apiData && field.apiDataKey && field.text
      ? refDataString(field.text, field?.apiDataKey, apiData)
      : field.text;
  return (
    <LabelLib id={field.identifier} text={str} className={field.className}>
      {children}
    </LabelLib>
  );
};

export default Label;

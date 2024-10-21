'use client';

import React from 'react';
import { Hint as HintLib } from '@mhra/mhra-design-components';
import FieldFactory, { FieldType } from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';
import { HintComponentProps } from '@mhra/mhra-design-components/dist/components/hint/hint.types';
import { refDataString } from 'core/util/stringModifier';

export interface HintFieldType extends HintComponentProps {
  type: 'hint';
  identifier: string;
  fields?: FieldType[];
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

interface HintProps {
  field: HintFieldType;
  errorSummary: ErrorSummaryType;
  apiData?: Object;
}

const Hint: React.FC<HintProps> = ({ field, errorSummary, apiData }) => {
  const children = field.fields?.map((childField, index) => (
    <FieldFactory key={index} field={childField} errorSummary={errorSummary} />
  ));

  const str =
    apiData && field.apiDataKey && field.text
      ? refDataString(field.text, field?.apiDataKey, apiData)
      : field.text;
  return (
    <HintLib id={field.identifier} text={str} className={field.className}>
      {children}
    </HintLib>
  );
};

export default Hint;

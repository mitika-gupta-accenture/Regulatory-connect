'use client';

import React from 'react';
import { Caption as CaptionLib } from '@mhra/mhra-design-components';
import { FieldType } from './FieldFactory';
import { refDataString } from '../util/stringModifier';
import { CaptionComponentProps } from '@mhra/mhra-design-components/dist/components/caption/caption.types';

export interface CaptionFieldType extends CaptionComponentProps {
  identifier: string;
  fields?: FieldType[];
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

interface CaptionProps {
  field: CaptionFieldType;
  apiData?: Object;
}

const Caption: React.FC<CaptionProps> = ({ field, apiData }) => {

  const str =
    apiData && field.apiDataKey && field.text
      ? refDataString(field.text, field?.apiDataKey, apiData)
      : field.text;

  return (
    <CaptionLib id={field.identifier} text={str} type={field.type} size={field.size} className={field.className}/>
  );
};

export default Caption;
'use client';

import React from 'react';
import { InsetText as InsetTextLib } from '@mhra/mhra-design-components';
import { InsetTextProps } from '@mhra/mhra-design-components/dist/components/insetText/insetText.types';
import { refDataString } from 'core/util/stringModifier';

export interface InsetFieldType extends InsetTextProps {
  type: 'insetText';
  id?: string;
  identifier: string;
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

const InsetText = ({
  field,
  apiData,
}: {
  field: InsetFieldType;
  apiData?: Object;
}) => {
  const str =
    apiData && field.apiDataKey && field?.text
      ? refDataString(field?.text, field.apiDataKey, apiData)
      : field?.text;
  return (
    <InsetTextLib id={field.id} text={str} className={field.className}>
      {field.children}
    </InsetTextLib>
  );
};

export default InsetText;

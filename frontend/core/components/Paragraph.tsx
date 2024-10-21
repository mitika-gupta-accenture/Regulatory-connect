'use client';

import { Paragraph as ParagraphLib } from '@mhra/mhra-design-components';
import { ParagraphProps } from '@mhra/mhra-design-components/dist/components/paragraph/paragraph.type';
import { refDataString } from 'core/util/stringModifier';

export interface ParagraphFieldType
  extends Omit<ParagraphProps, 'id' | 'text'> {
  type: 'paragraph';
  identifier?: string;
  content: string[];
  id?: string;
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

const Paragraph = ({
  field,
  apiData,
}: {
  field: ParagraphFieldType;
  apiData?: Object;
}) => {
  return (
    <>
      {field?.content?.map((line: string, index: number) => {
        const str =
          apiData && field.apiDataKey
            ? refDataString(line, field?.apiDataKey, apiData)
            : line;
        return (
          <ParagraphLib
            text={str}
            key={
              field.id ? `${field.id}-${index}` : `${field.identifier}-${index}`
            }
            id={field.id || `${field.identifier}-${index}`}
            className={field.className}
            size={field.size}
          />
        );
      })}
    </>
  );
};

export default Paragraph;

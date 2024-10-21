'use client';

import React from 'react';
import { UnorderedList } from '@mhra/mhra-design-components';
import { UnorderedListProps } from '@mhra/mhra-design-components/dist/components/unorderedList/unorderedList.types';
import FieldFactory, { FieldType } from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';

export interface ListFieldType extends Omit<UnorderedListProps, 'children'> {
  fields: any;
  type: 'unorderedlist';
  name: string;
  identifier: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

export type ListItem = {
  text: string;
  href?: string;
  className?: string;
};

export default function UnorderedListWrapper({
  field,
  errorSummary,
  previousAnswer,
  apiData,
}: {
  field: ListFieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  apiData?: Object;
}) {
  return (
    field?.fields ? <UnorderedList
      listStyle={field.listStyle}
      listType={field.listType}
      listItems={field.fields.map((field: any, index: any) => {
        return {
          text: (
            <FieldFactory
              key={index}
              field={field}
              previousAnswer={previousAnswer}
              errorSummary={errorSummary}
              apiData={apiData}
            />
          ),
        };
      })}
    />
      : <></>
  );
}

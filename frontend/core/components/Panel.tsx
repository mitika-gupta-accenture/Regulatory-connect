'use client';

import React from 'react';
import { Panel as PanelLib } from '@mhra/mhra-design-components';
import { PanelComponentProps } from '@mhra/mhra-design-components/dist/components/panel/panel.types';
import FieldFactory from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';
import { answer } from './Summary';

export interface PanelFieldType extends PanelComponentProps {
  fields: any;
  type: 'panel';
  title?: string;
  identifier?: string;
  className?: string;
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}

export default function Panel({
  field,
  apiData,
  errorSummary,
  allPreviousAnswers,
}: {
  field: PanelFieldType;
  apiData?: Object;
  errorSummary: ErrorSummaryType;
  allPreviousAnswers?: answer[];
}) {
  return (
    <PanelLib
      title={field.title}
      id={field.identifier}
      className={field.className}
      data-testid="panel"
    >
        {field.fields.map((field: any, index: any) => (
          <FieldFactory
            key={index}
            field={field}
            errorSummary={errorSummary}
            allPreviousAnswers={allPreviousAnswers}
            apiData={apiData}
          />
        ))}
    </PanelLib>
  );
}

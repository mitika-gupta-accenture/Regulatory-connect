'use client';
import React, { useRef } from 'react';
import { GridCol, GridRow } from '@mhra/mhra-design-components';
import { SummaryList as SummaryListLib } from '@mhra/mhra-design-components';
import {
  SummaryListProps,
  SummaryListItemProps,
} from '@mhra/mhra-design-components/dist/components/summaryList/summaryList.types';
import FieldFactory, { FieldType } from './FieldFactory';
import SummaryItem from './SummaryItem';

export interface SummaryListFieldType extends SummaryListProps {
  type: 'summaryList';
  fields: SummaryListRowType[];
  apiDataKey?: string;
  identifier: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  showChangeLinkInSummary?: boolean;
}
interface SummaryListRowType {
  name: FieldType;
  values: FieldType[];
  actions: FieldType[];
}

export interface AnswersType {
  question: string;
  sectionName: string;
  answers: answer[];
  nextRoute: string;
  identifier: string;
}

export type answer = {
  answer: string;
  label: string;
  identifier: string;
  showChangeLinkInSummary?: boolean;
  apiDataKey?: string;
};

function Summary({
  answers,
  formPath,
  field,
  apiData,
  useForFieldFactory,
  title = 'Check and confirm your answers',
}: {
  answers: AnswersType[];
  field?: SummaryListFieldType;
  formPath: string;
  useForFieldFactory?: boolean;
  apiData?: Object;
  title?: string;
}) {
  const contentRef = useRef(null);

  const items: SummaryListItemProps[] = field
    ? field.fields.map((childField: any) => {
        const errorSummary = {
          title: '',
          errors: [],
        };

        return {
          name: (
            <FieldFactory
              key={`${childField.name.identifier}-name`}
              field={childField.name}
              errorSummary={errorSummary}
              allPreviousAnswers={[]}
              apiData={apiData}
            />
          ),
          value: Array.isArray(childField.values) ? (
            <>
              {childField.values.map((value: FieldType, index: number) => (
                <React.Fragment key={`${value.identifier}-value-${index}`}>
                  {index !== 0 && <br />}
                  <FieldFactory
                    field={value}
                    errorSummary={errorSummary}
                    allPreviousAnswers={[]}
                    apiData={apiData}
                  />
                </React.Fragment>
              ))}
            </>
          ) : (
            <></>
          ),
          actions: Array.isArray(childField.actions)
            ? childField.actions.map((action: FieldType, index: number) => (
                <React.Fragment key={`${action.identifier}-action-${index}`}>
                  <FieldFactory
                    field={action}
                    errorSummary={errorSummary}
                    allPreviousAnswers={[]}
                    apiData={apiData}
                  />
                </React.Fragment>
              ))
            : [],
        };
      })
    : [];
  return (
    <>
      {useForFieldFactory ? (
        <SummaryListLib items={items} />
      ) : (
        <>
          {title && <h1 className="govuk-summary-title">{title}</h1>}
          <div ref={contentRef}>
            <div className="govuk-summary">
              <div className="govuk-summary-content">
                <dl
                  className="govuk-summary-list govuk-!-margin-bottom-9"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {answers.map((a, index) => {
                    return (
                      <SummaryItem
                        key={index}
                        question={a}
                        formPath={formPath}
                      />
                    );
                  })}
                </dl>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Summary;

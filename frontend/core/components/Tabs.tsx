'use client';

import React from 'react';
import { ErrorSummaryType } from './ErrorSummary';
import { Heading, UnorderedList } from '@mhra/mhra-design-components';

export interface TabsFieldType {
  type: 'tabs';
  identifier?: string;
  tabs: Tab[];
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

type Tab = {
  heading: string;
  content: string[];
};

function Tabs({
  field,
  errorSummary,
}: {
  field: TabsFieldType;
  errorSummary: ErrorSummaryType;
}) {
  const tabListItems = field.tabs.map(tab => ({
    href: `#${tab.heading}`,
    text: tab.heading,
  }));
  return (
    <div className="govuk-tabs" data-module="govuk-tabs">
      <Heading className="govuk-tabs__title" text="Contents" />
      <UnorderedList className="govuk-tabs__list" listItems={tabListItems} />

      {field.tabs.map((tab, index) => {
        return (
          <div
            className={`govuk-tabs__panel`}
            id={tab.heading}
            key={index}
            data-testid={`tab-panel-${tab.heading}`}
          >
            <Heading
              className="govuk-heading-l"
              text={tab.heading}
              size="l"
              data-testid={`tab-panel-${tab.heading}`}
            />
            {tab.content.map((line, index) => {
              return (
                <p
                  className="govuk-body"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: line }}
                  data-testid={`tab-content-${index}-${tab.heading}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;

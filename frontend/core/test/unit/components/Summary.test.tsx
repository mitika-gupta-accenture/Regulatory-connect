import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary, { SummaryListFieldType } from 'core/components/Summary';

jest.mock('../../../components/FieldFactory', () => (props: any) => (
  <div data-testid={`field-${props.field.type}`}>
    {props.field.content || 'Default Content'}
  </div>
));

jest.mock('../../../components/SummaryItem', () => (props: any) => (
  <div data-testid={`summary-item-${props.question.identifier}`}>
    {props.question.question || 'Default Question'}
  </div>
));

describe('Summary Component', () => {
  const mockFields: SummaryListFieldType = {
    identifier: 'check-proposed-marketing-authorisation-holder-details',
    type: 'summaryList',
    fields: [
      {
        name: {
          identifier: 'check-marketing-neha1',
          type: 'plainText',
          apiDataKey: 'Company.content',
          content: 'Company name value',
        },
        values: [
          {
            identifier: 'check-marketing-1',
            name: 'check-marketing-1',
            listItems: [],
            type: 'unorderedlist',
            listStyle: 'bullet',
            fields: [
              { type: 'plainText', identifier: 'check-marketing-1', apiDataKey: 'Company.content', content: 'First data value' },
              { type: 'plainText', identifier: 'check-marketing-2', apiDataKey: 'Company.content', content: 'Second data value' },
            ],
          },
        ],
        actions: [
          { identifier: 'check-marketing-22', id: 'check-marketing-21', type: 'link', href: '/change', text: 'Change' },
          { identifier: 'check-marketing-21', id: 'check-marketing-21', type: 'link', href: '/Delete', text: 'Delete' },
        ],
      },
      {
        name: {
          identifier: 'check-marketing-neha1',
          type: 'plainText',
          apiDataKey: 'Company.content',
          content: 'ABC Company name value',
        },
        values: [
          { identifier: 'check-marketing-1', type: 'plainText', apiDataKey: 'Company.content', content: 'First Text value' },
          { identifier: 'check-marketing-2', type: 'plainText', apiDataKey: 'Company.content', content: 'Second text value' },
        ],
        actions: [
          { identifier: 'check-marketing-22', id: 'check-marketing-22', type: 'link', href: '/change', text: 'Change' },
          { identifier: 'check-marketing-21', id: 'check-marketing-21', type: 'link', href: '/Delete', text: 'Delete' },
        ],
      },
    ],
    items: [],
  };

  const mockAnswers = [
    {
      question: 'What is your company name?',
      sectionName: 'Company Information',
      answers: [{ answer: 'ABC Company', label: 'Company Name', identifier: 'company-name' }],
      nextRoute: '/next-step',
      identifier: 'company-info',
    },
    {
      question: 'What is your registration number?',
      sectionName: 'Registration Details',
      answers: [{ answer: '123456', label: 'Reg No', identifier: 'reg-no' }],
      nextRoute: '/next-step',
      identifier: 'reg-info',
    },
  ];

  it('should render SummaryItem components when useForFieldFactory is false', () => {
    render(
      <Summary
        answers={mockAnswers}
        formPath="/form"
        useForFieldFactory={false}
      />
    );

    expect(screen.getByText('Check and confirm your answers')).toBeInTheDocument();

    mockAnswers.forEach((answer, index) => {
      expect(screen.getByTestId(`summary-item-${answer.identifier}`)).toBeInTheDocument();
    });
  });

  it('should render Summary component correctly', () => {
    const { getByText } = render(
      <Summary
        field={mockFields}
        apiData={{}}
        formPath=""
        answers={[]}
        useForFieldFactory={true}
      />
    );

    expect(getByText('Company name value')).toBeInTheDocument();
    expect(getByText('ABC Company name value')).toBeInTheDocument();
  });

  it('should render Summary component with empty fields', () => {
    const emptyFields: SummaryListFieldType = {
      identifier: 'empty',
      type: 'summaryList',
      fields: [],
      items: [],
    };

    render(
      <Summary
        field={emptyFields}
        apiData={{}}
        formPath=""
        answers={[]}
        useForFieldFactory={true}
      />
    );

    expect(screen.queryByText('Company name value')).toBeNull();
    expect(screen.queryByText('ABC Company name value')).toBeNull();
  });

  it('should handle missing values and actions gracefully', () => {
    const missingValuesFields: SummaryListFieldType = {
      identifier: 'missing-values',
      type: 'summaryList',
      fields: [
        {
          name: {
            identifier: 'name-1',
            type: 'plainText',
            content: 'Name with missing values',
          },
          values: [],
          actions: [],
        },
      ],
      items: [],
    };

    const { getByText } = render(
      <Summary
        field={missingValuesFields}
        apiData={{}}
        formPath=""
        answers={[]}
        useForFieldFactory={true}
      />
    );

    expect(getByText('Name with missing values')).toBeInTheDocument();
    expect(screen.queryByTestId('field-link')).toBeNull();
  });

  it('should handle invalid values type gracefully', () => {
    const invalidValuesFields: SummaryListFieldType = {
      identifier: 'invalid-values',
      type: 'summaryList',
      fields: [
        {
          name: {
            identifier: 'name-invalid',
            type: 'plainText',
            content: 'Invalid Values Test',
          },
          values: {} as any,
          actions: [],
        },
      ],
      items: [],
    };

    const { getByText } = render(
      <Summary
        field={invalidValuesFields}
        apiData={{}}
        formPath=""
        answers={[]}
        useForFieldFactory={true}
      />
    );

    expect(getByText('Invalid Values Test')).toBeInTheDocument();
  });

  it('should handle different field types correctly', () => {
    const specialFieldTypes: SummaryListFieldType = {
      identifier: 'special-types',
      type: 'summaryList',
      fields: [
        {
          name: {
            identifier: 'name-special',
            type: 'plainText',
            content: 'Special Field Types',
          },
          values: [
            {
              identifier: 'special-list',
              name: 'check-marketing-1',
              listItems: [],
              type: 'unorderedlist',
              listStyle: 'bullet',
              fields: [
                { type: 'plainText', identifier: 'item-1', content: 'Data 1' },
                { type: 'plainText', identifier: 'item-2', content: 'Data 2' },
              ],
            },
          ],
          actions: [
            { identifier: 'action-1', id: 'action-1', type: 'link', href: '/edit', text: 'Edit' },
          ],
        },
      ],
      items: [],
    };

    const { getByText } = render(
      <Summary
        field={specialFieldTypes}
        apiData={{}}
        formPath=""
        answers={[]}
        useForFieldFactory={true}
      />
    );

    expect(getByText('Special Field Types')).toBeInTheDocument();
  });
});
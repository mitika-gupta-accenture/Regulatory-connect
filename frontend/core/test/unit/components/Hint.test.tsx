import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HintWrapper, { HintFieldType } from '../../../components/Hint';
import FieldFactory, { FieldType } from '../../../components/FieldFactory';
import { ErrorSummaryType } from '../../../components/ErrorSummary';
import { HintComponentProps } from '@mhra/mhra-design-components/dist/components/hint/hint.types';

jest.mock('../../../components/FieldFactory', () =>
  jest.fn(() => <div data-testid="mock-field-factory"></div>),
);

jest.mock('@mhra/mhra-design-components', () => ({
  Hint: ({ id, text, className, children }: HintComponentProps) => (
    <div id={id} className={className}>
      {text}
      {children}
    </div>
  ),
}));

describe('HintWrapper', () => {
  const mockField: HintFieldType = {
    type: 'hint',
    identifier: 'test-identifier',
    id: 'test-id',
    text: 'Test Hint',
    children: null,
    className: 'test-class',
  };

  const errorSummary: ErrorSummaryType = {
    title: 'Error Summary',
    errors: [
      { linkId: 'field1', message: 'Error 1' },
      { linkId: 'field2', message: 'Error 2' },
    ],
  };

  it('renders Hint with correct props when no child fields are present', () => {
    const { getByText, container } = render(
      <HintWrapper field={mockField} errorSummary={errorSummary} />,
    );

    expect(getByText('Test Hint')).toBeInTheDocument();
    expect(container.querySelector('#test-identifier')).toHaveClass(
      'test-class',
    );
  });

  it('renders child fields using FieldFactory when child fields are present', () => {
    const childField: FieldType = {
      type: 'paragraph',
      identifier: 'child-id',
      content: ['string'],
    };
    const fieldWithChildren = {
      ...mockField,
      fields: [childField],
    };

    const { container, getAllByTestId } = render(
      <HintWrapper field={fieldWithChildren} errorSummary={errorSummary} />,
    );

    expect(container.querySelector('#test-identifier')).toBeInTheDocument();
    expect(getAllByTestId('mock-field-factory')).toHaveLength(1);
  });

  it('renders Hint with apiDataKey', () => {
    const fieldWithapidataKey = {
      ...mockField,
      text: '###',
      apiDataKey: 'USER_SESSION.content',
    };

    const { getByText, container } = render(
      <HintWrapper
        field={fieldWithapidataKey}
        errorSummary={errorSummary}
        apiData={{
          USER_SESSION: {
            content: 'Content is from API',
          },
        }}
      />,
    );

    expect(getByText('Content is from API')).toBeInTheDocument();
    expect(container.querySelector('#test-identifier')).toHaveClass(
      'test-class',
    );
  });
});

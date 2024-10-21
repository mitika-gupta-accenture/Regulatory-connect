import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Details, { DetailsFieldType } from '../../../components/Details';
import FieldFactory from '../../../components/FieldFactory';
import { Details as DetailsLib } from '@mhra/mhra-design-components';
import { ErrorSummaryType } from '../../../components/ErrorSummary';
import { answer } from '../../../components/Summary'; 

jest.mock('@mhra/mhra-design-components', () => ({
  Details: jest.fn(({ children }) => (
    <div data-testid="mock-details">{children}</div>
  )),
}));

jest.mock('../../../components/FieldFactory', () =>
  jest.fn(() => <div data-testid="mock-field-factory"></div>),
);

describe('Details component', () => {
  const baseField: DetailsFieldType = {
    type: 'details',
    identifier: 'details1',
    heading: 'Details Heading',
    id: '',
    fields: [
      {
        type: 'paragraph',
        content: ['test content'],
        identifier: 'field1',
      },
    ],
    open: true,
    className: 'details-class',
  };

  const errorSummary: ErrorSummaryType = {
    title: 'Error Summary',
    errors: [
      { linkId: 'field1', message: 'Error 1' },
      { linkId: 'field2', message: 'Error 2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('renders DetailsLib component with correct props', () => {
    const { getByTestId } = render(
      <Details field={baseField} errorSummary={errorSummary} apiData={{
        USER_SESSION: {
          content: 'Content is from API',
        }
      }} />,
    );

    expect(getByTestId('mock-details')).toBeInTheDocument();
    expect(DetailsLib).toHaveBeenCalledWith(
      expect.objectContaining({
        className: baseField.className,
        id: baseField.identifier,
        open: baseField.open,
        heading: baseField.heading,
      }),
      {},
    );
  });

  it('renders FieldFactory components for each field', () => {
    const { getAllByTestId } = render(
      <Details field={baseField} errorSummary={errorSummary} apiData={{
        USER_SESSION: {
          content: 'Content is from API',
        }
      }} />,
    );

    const fieldFactories = getAllByTestId('mock-field-factory');
    expect(fieldFactories).toHaveLength(baseField.fields.length);

    expect(FieldFactory).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        field: baseField.fields[0],
        errorSummary,
      }),
      {},
    );
  });

  it('passes previousAnswer when allPreviousAnswers is provided and identifier matches', () => {
    const allPreviousAnswers: answer[] = [
      { identifier: 'field1', answer: 'Previous answer', label: 'Field 1' },
    ];

    render(
      <Details field={baseField} errorSummary={errorSummary} allPreviousAnswers={allPreviousAnswers} />
    );

    expect(FieldFactory).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        previousAnswer: 'Previous answer',
      }),
      {},
    );
  });

  it('passes empty string as previousAnswer when allPreviousAnswers is provided but no match', () => {
    const allPreviousAnswers: answer[] = [
      { identifier: 'field2', answer: 'Previous answer', label: 'Field 2' },
    ];

    render(
      <Details field={baseField} errorSummary={errorSummary} allPreviousAnswers={allPreviousAnswers} />
    );

    expect(FieldFactory).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        previousAnswer: '',
      }),
      {},
    );
  });

  it('handles cases where allPreviousAnswers is not provided', () => {
    render(
      <Details field={baseField} errorSummary={errorSummary} />
    );

    expect(FieldFactory).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        previousAnswer: '',
      }),
      {},
    );
  });

  it('passes apiData to FieldFactory when apiData is provided', () => {
    const apiData = {
      USER_SESSION: {
        content: 'API Content',
      },
    };

    render(
      <Details field={baseField} errorSummary={errorSummary} apiData={apiData} />
    );

    expect(FieldFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        apiData,
      }),
      {},
    );
  });
});
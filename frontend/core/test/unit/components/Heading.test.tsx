import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeadingWrapper, { HeadingFieldType } from '../../../components/Heading';
import { ErrorSummaryType } from '../../../components/ErrorSummary';

describe('HeadingWrapper Component', () => {
  const mockField: HeadingFieldType = {
    type: 'heading',
    identifier: 'test-identifier',
    text: 'Test Heading',
    id: 'test-heading-id',
    level: 2,
    size: 'l',
    className: 'test-class',
    fields: [
      {
        type: 'input',
        name: 'test-input',
        identifier: 'test-input-identifier',
        text: 'Test Input',
        id: 'test-input-id',
      },
    ],
  };

  const mockErrorSummary: ErrorSummaryType = {
    title: 'Error Summary',
    errors: [],
  };

  it('renders the heading with the correct text', () => {
    const { getByText } = render(<HeadingWrapper field={mockField} errorSummary={mockErrorSummary} />);
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders the heading with the correct level and size', () => {
    const { container } = render(<HeadingWrapper field={mockField} errorSummary={mockErrorSummary} />);
    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('test-class');
  });

  it('renders without crashing when no children are provided', () => {
    const fieldWithoutChildren: HeadingFieldType = {
      ...mockField,
      fields: undefined,
    };
    const { getByText } = render(<HeadingWrapper field={fieldWithoutChildren} errorSummary={mockErrorSummary} />);
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders Hint with apiDataKey', () => {
    const fieldWithapidataKey = {
      ...mockField,
      text: '###',
      apiDataKey: 'USER_SESSION.content',
    };

    const { getByText, container } = render(
      <HeadingWrapper
        field={fieldWithapidataKey}
        errorSummary={mockErrorSummary}
        apiData={{
          USER_SESSION: {
            content: 'Heading Text from API',
          },
        }}
      />,
    );

    expect(getByText('Heading Text from API')).toBeInTheDocument();
    expect(container.querySelector('#test-identifier')).toHaveClass(
      'test-class',
    );
  });
});

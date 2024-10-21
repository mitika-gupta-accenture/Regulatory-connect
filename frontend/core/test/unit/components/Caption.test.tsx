import React from 'react';
import { getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CaptionWrapper, { CaptionFieldType } from '../../../components/Caption';
import FieldFactory, { FieldType } from '../../../components/FieldFactory';
import { CaptionComponentProps } from '@mhra/mhra-design-components/dist/components/caption/caption.types';

jest.mock('../../../components/FieldFactory', () =>
  jest.fn(() => <div data-testid="mock-field-factory"></div>),
);

jest.mock('@mhra/mhra-design-components', () => ({
  Caption: ({ id, text, className }: CaptionComponentProps) => (
    <span id={id} className={className} data-testid="mock-field-factory">
      {text}
    </span>
  ),
}));

describe('CaptionWrapper', () => {
  const mockField: CaptionFieldType = {
    type: 'govuk-caption',
    identifier: 'test-identifier',
    id: 'test-id',
    text: 'Test Caption',
    className: 'test-class',
  };


  it('renders Caption with correct props when no child fields are present', () => {
    const { getByText, container } = render(
      <CaptionWrapper field={mockField} />
    );

    expect(getByText('Test Caption')).toBeInTheDocument();
    expect(container.querySelector('#test-identifier')).toHaveClass(
      'test-class',
    );
  });
 
  it('renders Caption with apiDataKey', () => {
    const fieldWithapidataKey = {
      ...mockField,
      text: '###',
      apiDataKey: 'USER_SESSION.content',
    };

    const { getByText, container } = render(
      <CaptionWrapper
        field={fieldWithapidataKey}
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

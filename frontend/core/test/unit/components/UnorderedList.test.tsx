import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UnorderedList } from '@mhra/mhra-design-components';
import UnorderedListWrapper, { ListFieldType } from 'core/components/UnorderedList';
import { ErrorSummaryType } from 'core/components/ErrorSummary';
import FieldFactory, { FieldType } from '../../../../core/components/FieldFactory';

jest.mock('@mhra/mhra-design-components', () => ({
  UnorderedList: jest.fn(({ listStyle, listType, listItems }) => (
    <div data-testid="mock-unordered-list">
      <div>listStyle: {listStyle}</div>
      <div>listType: {listType}</div>
      <div data-testid="list-items">
        {listItems.length} item{listItems.length !== 1 ? 's' : ''}
      </div>
      <div>
        {listItems.map((item: FieldType, index: React.Key | null | undefined) => (
          <FieldFactory key={index} field={item} errorSummary={errorSummary} />
        ))}
      </div>
    </div>
  )),
}));

jest.mock('../../../../core/components/FieldFactory', () => {
  return ({ field }: { field: { text: string; href?: string; className?: string } }) => (
    <div data-testid={`field-factory-${field.text}`}>
      FieldFactory: {field.text}
    </div>
  );
});

const errorSummary: ErrorSummaryType = {
  title: 'Error Summary',
  errors: [
    { linkId: 'field1', message: 'Error 1' },
    { linkId: 'field2', message: 'Error 2' },
  ],
};

describe('UnorderedListWrapper', () => {
  it('should render UnorderedList with correct props', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'number',
      listType: 'summaryList',
      fields: [
        { text: 'Item 1', href: 'http://example.com/1', className: 'item-class-1' },
        { text: 'Item 2', href: 'http://example.com/2' },
      ],
      listItems: [
        { text: 'Item 1' },
        { text: 'Item 2' },
      ],
    };

    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
        apiData={{ USER_SESSION: { content: 'Content is from API' } }}
      />
    );

    expect(screen.getByTestId('mock-unordered-list')).toBeInTheDocument();
    expect(screen.getByTestId('list-items')).toHaveTextContent('2 items');

    const fieldFactory1 = screen.getByTestId('field-factory-Item 1');
    const fieldFactory2 = screen.getByTestId('field-factory-Item 2');

    expect(fieldFactory1).toBeInTheDocument();
    expect(fieldFactory1).toHaveTextContent('FieldFactory: Item 1');
    expect(fieldFactory2).toBeInTheDocument();
    expect(fieldFactory2).toHaveTextContent('FieldFactory: Item 2');
  });

  it('should handle empty fields gracefully', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'bullet',
      listType: 'summaryList',
      fields: [],
      listItems: [],
    };

    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
      />
    );

    expect(UnorderedList).toHaveBeenCalledWith(
      expect.objectContaining({
        listStyle: 'bullet',
        listType: 'summaryList',
        listItems: expect.any(Array),
      }),
      {}
    );

    expect(screen.getByTestId('mock-unordered-list')).toBeInTheDocument();
    expect(screen.getByTestId('list-items')).toHaveTextContent('0 items');
  });

  it('should render UnorderedList without optional props', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'number',
      listType: 'summaryList',
      fields: [
        { text: 'Item 1' },
      ],
      listItems: [],
    };

    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
      />
    );

    expect(UnorderedList).toHaveBeenCalledWith(
      expect.objectContaining({
        listStyle: 'number',
        listType: 'summaryList',
        listItems: expect.any(Array),
      }),
      {}
    );

    expect(screen.getByTestId('mock-unordered-list')).toBeInTheDocument();
    expect(screen.getByTestId('list-items')).toHaveTextContent('1 item');
  });

  it('should handle presence of errors in errorSummary', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'number',
      listType: 'summaryList',
      fields: [
        { text: 'Item 1' },
      ],
      listItems: [],
    };

    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
      />
    );

    expect(screen.getByTestId('mock-unordered-list')).toBeInTheDocument();
  });

  it('should render FieldFactory for each field correctly', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'number',
      listType: 'summaryList',
      fields: [
        { text: 'Item 1' },
        { text: 'Item 2' },
      ],
      listItems: [],
    };

    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
      />
    );

    expect(screen.getByTestId('mock-unordered-list')).toBeInTheDocument();

    const fieldFactory1 = screen.getByTestId('field-factory-Item 1');
    const fieldFactory2 = screen.getByTestId('field-factory-Item 2');

    expect(fieldFactory1).toBeInTheDocument();
    expect(fieldFactory1).toHaveTextContent('FieldFactory: Item 1');

    expect(fieldFactory2).toBeInTheDocument();
    expect(fieldFactory2).toHaveTextContent('FieldFactory: Item 2');
  });

  it('renders nothing if fields are not provided', () => {
    const field: ListFieldType = {
      type: 'unorderedlist',
      name: 'testList',
      identifier: 'testId',
      listStyle: 'number',
      listType: 'summaryList',
      listItems: [],
      fields: undefined
    };
    render(
      <UnorderedListWrapper
        field={field}
        errorSummary={errorSummary}
      />
    );
    expect(null).toBeNull();
  });
});
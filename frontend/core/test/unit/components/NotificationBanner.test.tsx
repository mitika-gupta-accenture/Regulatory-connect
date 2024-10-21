import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationBannerWrapper, {
  NotificationFieldType,
} from '../../../components/NotificationBanner';
import { HeadingComponentProps } from '@mhra/mhra-design-components/dist/components/heading/heading.types';
import { NotificationBanner as Notification } from '@mhra/mhra-design-components';
import FieldFactory from '../../../components/FieldFactory';
import { ErrorSummaryType } from '../../../components/ErrorSummary';

jest.mock('@mhra/mhra-design-components', () => ({
  NotificationBanner: jest.fn(({ children }) => (
    <div data-testid="mock-notification">{children}</div>
  )),
}));

jest.mock('../../../components/FieldFactory', () =>
  jest.fn(() => <div data-testid="mock-field-factory"></div>),
);

describe('NotificationBannerWrapper', () => {
  const baseHeaderProps: HeadingComponentProps = {
    text: 'Header Text',
    level: 2,
    size: 'm',
    className: 'header-class',
    id: 'header-id',
  };

  const baseContentHeadingProps: HeadingComponentProps = {
    text: 'Content Heading Text',
    level: 3,
    size: 's',
    className: 'content-heading-class',
    id: 'content-heading-id',
  };

  const baseField: NotificationFieldType = {
    type: 'notification-banner',
    identifier: 'notification-id',
    fields: [
      {
        type: 'paragraph',
        content: [
          'You have 7 days left to send your application.<a class="govuk-notification-banner__link" href="#">View application</a>.',
        ],
      },
    ],
    headerProps: baseHeaderProps,
    isSuccessBanner: true,
    contentHeadingProps: baseContentHeadingProps,
    id: '',
    children: undefined,
  };

  const errorSummary: ErrorSummaryType = {
    title: 'Error Summary',
    errors: [
      { linkId: 'field1', message: 'Error 1' },
      { linkId: 'field2', message: 'Error 2' },
    ],
  };

  it('renders Notification component with correct props', () => {
    const { getByTestId } = render(
      <NotificationBannerWrapper
        field={baseField}
        errorSummary={errorSummary}
      />,
    );

    expect(getByTestId('mock-notification')).toBeInTheDocument();
    expect(Notification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: baseField.identifier,
        className: baseField.className,
        headerProps: baseField.headerProps,
        isSuccessBanner: baseField.isSuccessBanner,
        contentHeadingProps: baseField.contentHeadingProps,
      }),
      {},
    );
  });

  it('renders FieldFactory components with correct props', () => {
    const { getAllByTestId } = render(
      <NotificationBannerWrapper
        field={baseField}
        errorSummary={errorSummary}
      />,
    );

    const fieldFactories = getAllByTestId('mock-field-factory');
    expect(fieldFactories).toHaveLength(1);

    expect(FieldFactory).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        field: baseField.fields[0],
        errorSummary,
      }),
      {},
    );
  });

  it('renders correctly when contentHeadingProps is not provided', () => {
    const modifiedField = { ...baseField, contentHeadingProps: undefined };

    const { getByTestId } = render(
      <NotificationBannerWrapper
        field={modifiedField}
        errorSummary={errorSummary}
      />,
    );

    expect(getByTestId('mock-notification')).toBeInTheDocument();
    expect(Notification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: modifiedField.identifier,
        className: modifiedField.className,
        headerProps: modifiedField.headerProps,
        isSuccessBanner: modifiedField.isSuccessBanner,
        contentHeadingProps: undefined,
      }),
      {},
    );
  });
});

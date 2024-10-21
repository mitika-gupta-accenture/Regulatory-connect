'use client';
import React from 'react';
import { NotificationBanner as NotificationBannerLib } from '@mhra/mhra-design-components';
import { NotificationBannerProps } from '@mhra/mhra-design-components/dist/components/notificationBanner/notificationBanner.types';
import FieldFactory, { FieldType } from './FieldFactory';
import { ErrorSummaryType } from './ErrorSummary';

export interface NotificationFieldType extends NotificationBannerProps {
  type: 'notification-banner';
  identifier: string;
  fields: FieldType[];
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

export default function NotificationBanner({
  field,
  errorSummary,
}: {
  field: NotificationFieldType;
  errorSummary: ErrorSummaryType;
}) {
  const children = field?.fields?.map((field, index) => {
    return (
      <FieldFactory key={index} field={field} errorSummary={errorSummary} />
    );
  });
  return (
    <NotificationBannerLib
      id={field.identifier}
      className={field.className}
      headerProps={field.headerProps}
      isSuccessBanner={field.isSuccessBanner}
      contentHeadingProps={field.contentHeadingProps}
      children={children}
    />
  );
}

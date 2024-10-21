import React from 'react';
import NextLink from 'next/link';
import { VisuallyHidden } from '@mhra/mhra-design-components';

export interface LinkType {
  type: 'link';
  prefetch?: boolean;
  href: string;
  text?: string;
  className?: string;
  opensInNewTab?: boolean;
  noVisitedState?: boolean;
  isInverse?: boolean;
  noUnderline?: boolean;
  id: string;
  children?: React.ReactNode;
  identifier?: string;
  apiDataKey?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  visuallyHiddenText?: string;
  showChangeLinkInSummary?: boolean;
}

export default function Link({
  id,
  href,
  noVisitedState,
  isInverse,
  noUnderline,
  className,
  opensInNewTab,
  prefetch,
  children,
  visuallyHiddenText,
}: LinkType) {
  const linkClassName = `govuk-link${noVisitedState ? ' govuk-link--no-visited-state' : ''}${isInverse ? ' govuk-link--inverse' : ''}${noUnderline ? ' govuk-link--no-underline' : ''}`;
  return (
      <NextLink
        id={id}
        href={href}
        prefetch={prefetch}
        className={linkClassName.trim()}
        {...(opensInNewTab
          ? { rel: 'noreferrer noopener', target: '_blank' }
          : {})}
      >
        {children}
        {visuallyHiddenText ? (
          <VisuallyHidden>{visuallyHiddenText}</VisuallyHidden>
        ) : (
          ''
        )}
      </NextLink>
  );
}

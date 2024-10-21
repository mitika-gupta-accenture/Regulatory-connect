'use client';

import { useEffect, useState } from 'react';
import { scrollToMainContent } from '../util/scrollToMainContent';

const SkipLink = () => {
  const [tabPressed, setTabPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Tab') {
        setTabPressed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <>
      {tabPressed && (
        <a
          data-testid="skip-link"
          aria-label="Skip to main content"
          href="#main-content"
          className="govuk-skip-link"
          onClick={scrollToMainContent}
          tabIndex={0}
          data-cy="skip-link"
        >
          Skip to main content
          <span className="govuk-visually-hidden">Skip to main content</span>
        </a>
      )}
    </>
  );
};

export default SkipLink;

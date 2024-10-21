'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function BackButton({ previousPage }: { previousPage?: string }) {
  const router = useRouter();
  const [currPath, setCurrPath] = useState('');
  const pathname = usePathname();
  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    setCurrPath(pathname);
  }, []);

  return previousPage ? (
    <>
      <Link
        id="govuk-back-link"
        href={previousPage}
        className="govuk-back-link"
        data-cy="govuk-back-link"
        type="link"
        key={`back-link-on-${currPath}`}
      >
        Back
      </Link>
    </>
  ) : (
    <>
      <Link
        id="govuk-back-link"
        href={'#'}
        className="govuk-back-link"
        data-cy="govuk-back-link"
        type="link"
        onClick={handleGoBack}
        key={`back-link-on-${currPath}`}
      >
        Back
      </Link>
    </>
  );
}

export default BackButton;

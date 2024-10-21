'use client';

import { ReactNode } from 'react';

export function Conditional({
  showWhen,
  children,
}: {
  showWhen: boolean;
  children: ReactNode;
}) {
  if (showWhen) return <>{children}</>;
  return <></>;
}

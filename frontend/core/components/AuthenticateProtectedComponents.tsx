'use client';
import React, { ReactNode } from 'react';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { usePathname } from 'next/navigation';
import { SessionTimeout } from './SessionTimeout';
import { MainLayout } from './MainLayout';

interface AppProps {
  children: ReactNode;
}

export function AuthenticatedApp({ children }: AppProps) {
  const authRequest = {
    scopes: ['openid', 'profile'],
  };

  const pathname = usePathname();
  const unProtectedRoutes = [
    '/',
    '/cookies-statement',
    '/accessibility-statement',
    '/privacy-policy',
    '/session-expired',
    '/not-found',
    '/contactmhra',
  ];

  if (unProtectedRoutes.includes(pathname)) {
    return <MainLayout withSignOut={false}>{children}</MainLayout>;
  } else {
    return (
      <MainLayout withSignOut={true}>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
        >
          <SessionTimeout>{children}</SessionTimeout>
        </MsalAuthenticationTemplate>
      </MainLayout>
    );
  }
}

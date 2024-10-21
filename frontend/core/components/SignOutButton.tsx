'use client';
import React from 'react';
import { useMsal } from '@azure/msal-react';

export const SignOutButton = ({ children }: { children: React.ReactNode }) => {
  const { instance } = useMsal();

  const handleLogout = () => {
    void instance.logoutRedirect({ postLogoutRedirectUri: '/' });
  };

  return <span onClick={handleLogout}>{children}</span>;
};

'use client';
import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../authConfig';

export const SignInButton = ({ children }: { children: React.ReactNode }) => {
  const { instance } = useMsal();

  const handleLogin = () => {
    sessionStorage.clear();
    localStorage.clear();

    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  };

  return <span onClick={handleLogin}>{children}</span>;
};

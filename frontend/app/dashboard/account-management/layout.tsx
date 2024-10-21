import ProtectedLayout from 'core/services/auth/withPermission';
import React, { ReactNode } from 'react';

interface AppProps {
  children: ReactNode;
}

function Layout({ children }: AppProps) {
  return (
    <ProtectedLayout
      requiredResource="Account Management"
      requiredPrivilege="Read/View"
    >
      {children}
    </ProtectedLayout>
  );
}

export default Layout;

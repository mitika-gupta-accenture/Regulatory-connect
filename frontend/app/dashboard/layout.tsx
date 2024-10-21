'use client';

import { ReactNode, useEffect, useState } from 'react';
import RedirectByUser from 'core/util/RedirectByUser';
import AccountMenu from 'core/components/AccountMenu';
import { isUserEnabled } from 'core/util/isUserEnabled';
import { usePermissions } from 'core/services/auth/usePermissions';
import { usePathname } from 'next/navigation';

interface AppProps {
  children: ReactNode;
}

const menuItems = [
  { label: 'Regulatory Management', link: '#' },
  { label: 'Account management', link: '/dashboard/account-management' },
  { label: 'Billing', link: '#' },
  { label: 'Messages', link: '#' },
];

function App({ children }: AppProps) {
  const [userEnabled, setUserEnabled] = useState(false);
  const { hasPermission } = usePermissions();
  const [accountManagementPerms, setAccountManagementPerms] =
    useState<boolean>(false);

  const path = usePathname();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userIsEnabled = await isUserEnabled();
        setUserEnabled(userIsEnabled);
        const hasAccountManagementPerms = hasPermission(
          'Account Management',
          'Read/View',
        );
        setAccountManagementPerms(hasAccountManagementPerms);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    void fetchUserDetails();
  }, [hasPermission]);

  if (userEnabled) {
    const fileteredMenuItems = accountManagementPerms
      ? menuItems
      : menuItems.filter(item => item.label !== 'Account management');
    return (
      <>
        <AccountMenu
          homeLink="/dashboard"
          menuItems={fileteredMenuItems}
          activeItem={path}
        />
        {children}
        <RedirectByUser isPage={false} shouldRedirect={false} />
      </>
    );
  }
  return <RedirectByUser isPage={false} shouldRedirect={false} />;
}

export default App;

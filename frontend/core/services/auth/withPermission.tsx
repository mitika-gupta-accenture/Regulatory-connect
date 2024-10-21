'use client';
import { useEffect, useState } from 'react';
import { getServerSidePermissions, hasPermission } from './permissions';
import { useRouter } from 'next/navigation';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredResource: string;
  requiredPrivilege: string;
}

export default function ProtectedLayout({
  children,
  requiredResource,
  requiredPrivilege,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const [permsChecked, setPermsChecked] = useState<boolean>(false);
  useEffect(() => {
    const checkPerms = async () => {
      try {
        const permissions = await getServerSidePermissions();
        const shouldRedirect = !hasPermission(
          permissions,
          requiredResource,
          requiredPrivilege,
        );
        if (shouldRedirect) {
          router.push('/access-denied');
        }
        setPermsChecked(!shouldRedirect);
      } catch (error) {
        console.error(error);
      }
    };
    void checkPerms();
  }, [requiredPrivilege, requiredResource, router]);

  if (permsChecked) {
    return <> {children} </>;
  } else {
    return null;
  }
}

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as session from '../models/redis';
import { Organisation, UserDetails } from 'core/models/apiModel';
import { isUserEnabled } from './isUserEnabled';
import { checkIfUserDetailsInSession } from './checkIfUserDetailsInSession';

function RedirectByUser({
  isPage,
  shouldRedirect = true,
}: {
  isPage: boolean;
  shouldRedirect?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleAccountStatus = async () => {
      try {
        const userDetails =
          (await checkIfUserDetailsInSession()) as UserDetails;
        const selectedOrganisation = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        if (!!userDetails) {
          const userIsEnabled = await isUserEnabled();
          if (
            userDetails.webUserAccountStatusName === 'Enabled' &&
            !!selectedOrganisation
          ) {
            if (shouldRedirect && userIsEnabled) {
              router.push('/dashboard');
            } else if (!userIsEnabled) {
              router.push('/access-denied');
            }
          } else if (
            userDetails.organisations &&
            shouldRedirect &&
            userDetails.organisations.length > 1
          ) {
            router.push('/select-organisation');
          } else {
            router.push('/onboard-organisation');
          }
        } else if (isPage) {
          router.push('/user-registration/confirm-your-details');
        }
      } catch (error) {
        console.error('Error fetching user data or checking account:', error);
      }
    };

    void handleAccountStatus();
  }, [router, isPage]);

  return <></>;
}

export default RedirectByUser;

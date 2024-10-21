'use client';
import RedirectByUser from 'core/util/RedirectByUser';
import { useEffect, useState } from 'react';
import * as session from '../../core/models/redis';

import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import { checkIfMicrosoftEmailExistsInDatabase } from 'core/util/checkIfMicrosoftEmailExistsInDatabase';

function Home() {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const [sessionSet, setSessionSet] = useState(false);

  useEffect(() => {
    const saveMicrosoftUserDetails = async () => {
      try {
        const microsoftUserDetails = await session.get('microsoftUserDetails');

        if (!microsoftUserDetails) {
          if (isAuthenticated && accounts.length > 0) {
            const account: AccountInfo = accounts[0];
            const microsoftUserDetails = account.idTokenClaims && {
              firstName: account.idTokenClaims.given_name,
              lastName: account.idTokenClaims.family_name,
              email: account.idTokenClaims.email,
            };
            await session.set(
              'microsoftUserDetails',
              JSON.stringify(microsoftUserDetails),
            );

            //checks if the current user exists, and if so sets userDetails and selectedOrganisation in session
            await checkIfMicrosoftEmailExistsInDatabase();
            setSessionSet(true);
          }
        }
      } catch (error) {
        console.error(
          'Error loading or setting microsoftUserDetails to redis:',
          error,
        );
      }
    };

    void saveMicrosoftUserDetails();
  }, [accounts, isAuthenticated]);

  if (sessionSet) {
    return (
      <>
        <RedirectByUser isPage={true} />
      </>
    );
  }
}

export default Home;

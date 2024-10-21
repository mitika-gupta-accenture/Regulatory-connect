'use client';

import { ReactNode, useEffect, useState } from 'react';
import RedirectByUser from 'core/util/RedirectByUser';
import * as session from '../../core/models/redis';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  const [sessionSet, setSessionSet] = useState(false);

  useEffect(() => {
    const checkIfMicrosoftUserExists = async () => {
      try {
        const microsoftUserDetails = session.get('microsoftUserDetails');
        setSessionSet(!!microsoftUserDetails);
      } catch (error) {
        console.error(
          'Error loading or setting microsoftUserDetails to redis:',
          error,
        );
      }
    };

    void checkIfMicrosoftUserExists();
  }, [sessionSet]);

  if (sessionSet) {
    return (
      <>
        {children}
        <RedirectByUser isPage={false} />
      </>
    );
  }
}

export default App;

import React, { useState, useEffect } from 'react';
import { TimeoutModal } from './TimeoutModal';
import { useRouter } from 'next/navigation';
import { renewSession as renewSessionServerAction } from 'app/session-expired/actions';
import * as session from 'core/models/redis';
import { useMsal } from '@azure/msal-react';

type SessionTimeoutProps = {
  children: React.ReactNode;
};

export function SessionTimeout({ children }: SessionTimeoutProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [remainingTime, setRemainingTime] = useState(-1);
  const [baseTimeout, setBaseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [renewingSession, setRenewingSession] = useState(false);
  const router = useRouter();
  const { instance } = useMsal();

  const baseTtl = Number(process.env.NEXT_PUBLIC_SESSION_TTL ?? 10);
  const timeoutMs = (baseTtl - 2) * 60 * 1000;

  function reset() {
    if (baseTimeout) {
      setRenewingSession(true);
      clearTimeout(baseTimeout);
    }
    setShowMessage(false);
    const timeoutId = setTimeout(() => {
      setShowMessage(true);
      setRemainingTime(120);
    }, timeoutMs);
    setBaseTimeout(timeoutId);
    setRemainingTime(-1);
  }

  // effect to set up initial timeout
  // will clear if navigated away before timeout occurs
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowMessage(true);
      setRemainingTime(120);
    }, timeoutMs);
    setBaseTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [timeoutMs]);

  // effect to clear timeout on navigation if it has been set
  useEffect(() => {
    return () => {
      if (baseTimeout) {
        clearTimeout(baseTimeout);
      }
    };
  }, [baseTimeout]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (remainingTime > 0) {
      console.log('setting modal timeout');
      timeoutId = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    }

    if (remainingTime <= 0 && showMessage) {
      const clearSession = async () => {
        await session.clear();
        await instance.clearCache();
        router.push('/session-expired');
      };
      setShowMessage(false);
      void clearSession();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [remainingTime, showMessage, router]);

  // effect to renew the session on clicking the 'stay on site' button
  // needs to be in useEffect because it uses a server action
  // to renew the cookie
  useEffect(() => {
    const renewSession = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      void (await renewSessionServerAction());
    };

    if (renewingSession) {
      void renewSession();
      setRenewingSession(false);
    }
  }, [renewingSession]);

  const defaultSignOut = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';
  const [signOutLink, setSignOutLink] = useState(defaultSignOut);

  useEffect(() => {
    if (typeof globalThis.window !== 'undefined' && globalThis.window?.location?.origin) {
      setSignOutLink(`${defaultSignOut}?post_logout_redirect_uri=${window.location.origin}`);
    }
  }, [globalThis.window]);

  function signOut() {
    void (session.clear().then(() => 
      instance.clearCache()
    ).then(() => {
      globalThis.sessionStorage.clear();
      globalThis.localStorage.clear();
    }).then(() => 
      globalThis.location.replace(signOutLink)
    ));
  }

  return (
    <>
      {children}
      {showMessage && (
        <TimeoutModal
          remainingTime={remainingTime}
          reset={reset}
          signOut={signOut}
        />
      )}
    </>
  );
}

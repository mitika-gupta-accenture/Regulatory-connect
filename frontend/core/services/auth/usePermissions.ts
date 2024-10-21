'use client';
import * as session from 'core/models/redis';
import { Organisation, UserDetails } from 'core/models/apiModel';
import getUserPrivileges from 'core/apis/cam/getUserPermissions';
import { useCallback, useEffect, useState } from 'react';
import {
  UserPermissions,
  getResourcePermissions,
  hasPermission,
} from './permissions';

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const { personIdentifier } = (await session.get(
          'userDetails',
        )) as UserDetails;
        const selectedOrg = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        const userPerms = await getUserPrivileges(
          personIdentifier,
          selectedOrg.identifier,
        );
        setPermissions(userPerms as UserPermissions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    void fetchPermissions();
  }, []);

  const checkPermission = useCallback(
    (resource: string, privilege: string) =>
      hasPermission(permissions, resource, privilege),
    [permissions],
  );

  const getPermissions = useCallback(
    (resource: string) => getResourcePermissions(permissions, resource),
    [permissions],
  );

  return {
    hasPermission: checkPermission,
    getResourcePermissions: getPermissions,
    loading,
    error,
  };
}

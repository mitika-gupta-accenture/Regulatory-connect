import getUserPrivileges from 'core/apis/cam/getUserPermissions';
import { Organisation, UserDetails } from 'core/models/apiModel';
import * as session from 'core/models/redis';

export interface Permission {
  predicate_condition: string;
  privelage_name: string;
  resource_name: string;
}

export type UserPermissions = Permission[];

export function hasPermission(
  permissions: UserPermissions,
  resource: string,
  privilege: string,
): boolean {
  return permissions.some(
    p => p.resource_name === resource && p.privelage_name === privilege,
  );
}

export function getResourcePermissions(
  permissions: UserPermissions,
  resource: string,
): string[] {
  return permissions
    .filter(p => p.resource_name === resource)
    .map(p => p.privelage_name);
}

export async function getServerSidePermissions(): Promise<UserPermissions> {
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
  return userPerms as UserPermissions;
}

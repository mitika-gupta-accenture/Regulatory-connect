'use server';

import { redirect } from 'node_modules/next/navigation';
import * as session from '../../core/models/redis';

export default async function setSelectedOrganisation(prevState, queryData) {
  const selectedOrganisation = await JSON.parse(
    queryData.get('selectedOrganisationRadio'),
  );

  await session.set('selectedOrganisation', selectedOrganisation);

  redirect('/dashboard');
}

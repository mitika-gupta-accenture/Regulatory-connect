import { Organisation } from 'core/models/apiModel';
import * as session from '../models/redis';

export const isUserEnabled = async (): Promise<boolean> => {
  try {
    const selectedOrganisation = (await session.get(
      'selectedOrganisation',
    )) as Organisation;

    if (!selectedOrganisation) {
      return false;
    }

    if (!selectedOrganisation.roleValidTo) {
      return true;
    }

    const validToDate = new Date(selectedOrganisation.roleValidTo);
    if (isNaN(validToDate.getTime())) {
      return false;
    }

    return validToDate.getTime() >= Date.now();
  } catch (error) {
    return false;
  }
};

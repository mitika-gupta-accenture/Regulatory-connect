import * as session from '../models/redis';
import { checkIfMicrosoftEmailExistsInDatabase } from './checkIfMicrosoftEmailExistsInDatabase';

export const checkIfUserDetailsInSession = async () => {
  try {
    const userDetails = await session.get('userDetails');
    const selectedOrganisation = await session.get('selectedOrganisation');
    if (!!userDetails) {
      return userDetails;
    } else {
      await checkIfMicrosoftEmailExistsInDatabase();
      return false;
    }
  } catch (error) {
    console.error('cound not check if user in session', error);
    return false;
  }
};

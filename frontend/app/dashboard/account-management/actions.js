'use server';
import getAllUserDetailsByOrganisationId from '../../../core/apis/cam/GetAllOrganisationUsersByOrganisationId';

export const userDetailsIsFound = async organisationId => {
  try {
    const userDetails = await getAllUserDetailsByOrganisationId(organisationId);
    return userDetails;
  } catch (error) {
    console.error('Error fetching user details on the server:', error);
    return null;
  }
};

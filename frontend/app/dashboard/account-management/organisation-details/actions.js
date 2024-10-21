'use server';
import getAllOrganisationDetailsById from '../../../../core/apis/cam/GetAllOrganisationDetailsById';

export const organisationDetailsIsFound = async organisationId => {
  try {
    const organisationDetails =
      await getAllOrganisationDetailsById(organisationId);
    return organisationDetails;
  } catch (error) {
    console.error('Error fetching organisation details on the server:', error);
    return null;
  }
};

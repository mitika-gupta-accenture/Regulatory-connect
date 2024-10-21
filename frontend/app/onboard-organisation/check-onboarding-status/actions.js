'use server';

import { redirect } from 'next/navigation';

export const submitOrganisationName = async (prevState, formData) => {
  const answer = await formData.get('organisation-name-radios');
  const userInput = await formData.get('organisationName');
  let errorSummary = { title: 'There is a problem', errors: [] };

  if (!answer) {
    errorSummary.errors.push({
      linkId: 'organisation-name-radios',
      message: 'Select an option',
    });
  }
  if (!userInput) {
    errorSummary.errors.push({
      linkId: 'organisationName',
      message: 'Enter your organisation name',
    });
  } else if (userInput.trim().length < 3) {
    errorSummary.errors.push({
      linkId: 'organisationName',
      message: 'Organisation name has to be over 3 characters',
    });
  }

  if (errorSummary.errors.length) {
    return { errorSummary: errorSummary };
  }

  redirect('/onboard-organisation');
};

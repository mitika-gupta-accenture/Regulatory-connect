'use server';

import { redirect } from 'next/navigation';
import { saveForm, submitAnswers } from '../actions';
import questions from '../../core/fields/onboard-organisation/index';

export const continueOnboardOrganisationForm = async (prevState, queryData) => {
  return saveForm(prevState, queryData, 'onboard-organisation', questions);
};

export const submitOnboardOrganisation = async prevState => {
  await submitAnswers(prevState, 'onboard-organisation');
};

export const confirmAppointedPerson = async (prevState, formData) => {
  const answer = formData.get('areYouAuthorised');
  switch (answer) {
    case 'Yes':
      return redirect('/onboard-organisation/check-onboarding-status');
    case 'No':
      return redirect('/onboard-organisation/not-authorised-to-onboard');
    default:
      return {
        ...prevState,
        error:
          'Select yes if you are authorised to act on behalf of your organisation',
      };
  }
};

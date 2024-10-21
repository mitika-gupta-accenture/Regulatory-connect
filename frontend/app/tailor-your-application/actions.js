'use server';

import { saveForm, submitAnswers } from '../actions';
import questions from '../../core/fields/pl/tailor-your-application/index';

export const continuePlTailorYourAppForm = async (prevState, queryData) => {
  return saveForm(prevState, queryData, 'tailor-your-application', questions);
};

export const submitPlTailorYourApp = async prevState => {
  await submitAnswers(prevState, 'tailor-your-application');
};

'use server';

import { invokePostApiOnSubmit, saveForm } from '../actions';
import { redirect } from 'next/navigation';
import questions from '../../core/fields/pl/generate-licence-number/index';
import { clearOnlyAnswers } from 'core/apis/common/clearOnlyAnswers';

export const continueGenerateLicenceForm = async (prevState, queryData) => {
  return saveForm(prevState, queryData, 'generate-licence-number', questions);
};

export const submitGenerateLicenceNumber = async () => {
  await invokePostApiOnSubmit(['POST_PL_NUMBER_GENERATION']);
  redirect(`/generate-licence-number/generation-successful`);
};

export const generateAnotherNumber = async () => {
  await clearOnlyAnswers();
  redirect(`/generate-licence-number/select-application-type`);
};

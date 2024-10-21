'use server';

import { saveForm } from '../actions';
import questions from '../../core/fields/pl/generate-dossier-id/index';

export const continueGenerateDossierID = async (prevState, queryData) => {
  return saveForm(prevState, queryData, 'generate-dossier-id', questions, [
    'POST_PL_GENERATE_DOSSIER_ID',
  ]);
};

import { QuestionType } from '../components/QuestionBuilder';
import aboutYou from './questions/about-you.json';
import additionalInformation from './questions/additional-information.json';
import reasonForReporting from './questions/reason-for-reporting.json';
import reviewAndSubmit from './questions/review-and-submit.json';
import sellerDetails from './questions/seller-details.json';
import supportingEvidence from './questions/supporting-evidence.json';

function getQuestionFields(): QuestionType[] {
  let typeList: QuestionType[] = [];

  typeList = typeList.concat(
    aboutYou as QuestionType[],
    additionalInformation as QuestionType[],
    reasonForReporting as QuestionType[],
    reviewAndSubmit as QuestionType[],
    sellerDetails as QuestionType[],
    supportingEvidence as QuestionType[],
  );

  return typeList;
}

export const questions = getQuestionFields();

export default questions;

import { QuestionType } from '../../components/QuestionBuilder';
import choosSubmissionType from './choose-submission-type.json';

function getQuestionFields(): QuestionType[] {
  let typeList: QuestionType[] = [];
  typeList = typeList.concat(choosSubmissionType as QuestionType[]);
  return typeList;
}

export const questions = getQuestionFields();

export default questions;

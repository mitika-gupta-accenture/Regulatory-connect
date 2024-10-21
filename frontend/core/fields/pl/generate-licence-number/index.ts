import { QuestionType } from 'core/components/QuestionBuilder';
import generateLn from './generate-licence-number.json';

function getQuestionFields(): QuestionType[] {
  let typeList: QuestionType[] = [];

  typeList = typeList.concat(generateLn as QuestionType[]);

  return typeList;
}

export const questions = getQuestionFields();

export default questions;

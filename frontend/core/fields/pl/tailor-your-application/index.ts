import { QuestionType } from 'core/components/QuestionBuilder';
import tailorApp from './tailor-your-application.json';

function getQuestionFields(): QuestionType[] {
  let typeList: QuestionType[] = [];

  typeList = typeList.concat(tailorApp as QuestionType[]);

  return typeList;
}

export const questions = getQuestionFields();

export default questions;

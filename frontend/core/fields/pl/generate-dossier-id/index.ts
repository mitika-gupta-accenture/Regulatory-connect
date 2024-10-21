import { QuestionType } from 'core/components/QuestionBuilder';
import generateDossierID from './generate-dossier-id.json';

function getQuestionFields(): QuestionType[] {
    let typeList: QuestionType[] = [];

    typeList = typeList.concat(generateDossierID as QuestionType[]);

    return typeList;
}

export const questions = getQuestionFields();

export default questions;
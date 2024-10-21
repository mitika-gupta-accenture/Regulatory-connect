'use server';
import * as session from 'core/models/redis';
import FieldFactory from 'core/components/FieldFactory';
import { RadioFieldType } from 'core/components/Radio';

export interface ProcedureRadiosType {
  type: 'server-component';
  identifier: string;
  section: string;
  rule: 'procedure-type-radios';
  fields: RadioFieldType[];
}

interface AnswerObj {
  identifier: string;
  answer: string;
  label?: string;
  route?: string;
}

export interface questionObj {
  question: string;
  sectionName: string;
  answers: AnswerObj[];
  nextRoute: string;
  identifier: string;
}

interface TerritoryAppAnswerType {
  apptype: string;
  territory: string;
}

async function getAnswers(): Promise<TerritoryAppAnswerType> {
  const appTypeAnswer = (await session.getAnswer(
    'what-type-of-application-are-you-making',
  )) as questionObj;

  const appType = appTypeAnswer.answers
    .filter(a => {
      return a.identifier === 'application-relation-radios';
    })
    .map(a => a.answer)[0];

  const territoryAnswer = (await session.getAnswer(
    'territory-product-sold-confirmation',
  )) as questionObj;

  const territory = territoryAnswer.answers
    .filter(a => {
      return a.identifier === 'territory-radios';
    })
    .map(a => a.answer)[0];

  return {
    apptype: appType,
    territory: territory,
  };
}

const NI_PROCEDURE_TYPES = [
  'National Procedure',
  'A mutual recognition procedure (according to article 28(2) of Directive 2001/83/EC)',
  'A decentralised procedure (according to article 28(3) of Directives 2001/83/EC)',
];

const GB_AND_THR_HR_INVALID_TYPES = [
  'National procedure - Access Partners',
  'National procedure - Project Orbis',
];
const UK_AND_THR_HR_INVALID_TYPES = ['National procedure - Access Partners'];

const THR_HR_APP_TYPE = [
  'Traditional Herbal Registration (THR)',
  'Simplified Homeopathic Registration (HR)',
];

export default async function ProcedureRadios({
  field,
}: {
  field: RadioFieldType;
}) {
  const errorSummary = { title: 'There is a problem', errors: [] };
  const answers = await getAnswers();

  switch (answers.territory) {
    case '247':
      field.answers = field.answers.filter(a =>
        NI_PROCEDURE_TYPES.includes(a.value),
      );
      break;
    case '249':
      if (THR_HR_APP_TYPE.includes(answers.apptype)) {
        field.answers = field.answers.filter(
          a => !GB_AND_THR_HR_INVALID_TYPES.includes(a.value),
        );
      }
      break;
    case '251':
      if (THR_HR_APP_TYPE.includes(answers.apptype)) {
        field.answers = field.answers.filter(
          a => !UK_AND_THR_HR_INVALID_TYPES.includes(a.value),
        );
      }
  }
  return <FieldFactory field={field} errorSummary={errorSummary} />;
}

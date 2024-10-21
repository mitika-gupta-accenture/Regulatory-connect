import { SubmissionType } from 'core/components/ChooseSubmissionTypeContent';
import { FieldType } from '../../components/FieldFactory';

export type Validation = {
  [key: string]: string;
};

export interface ApiSubGroupElementType {
  name: string;
  identifier: string;
  code: string;
  isActive: string;
}

export interface ApiPropType {
  answers?: Answer[];
  childAnswers?: Answer[];
  apiDataKey?: string;
}
export interface LabelType {
  [key: string]: string;
}

export interface Answer {
  value: string;
  label?: string;
  parentKey?: string;
  route?: string;
  fields?: Field[];
  hint?: string;
  code?: string;
}

export interface ApiElementType {
  name?: string;
  identifier?: string;
  code?: string;
  isActive?: string;
  subGroup?: ApiSubGroupElementType[];
  [key: string]: any;
}

export interface ApiResponseDataType {
  submissionType?: SubmissionType[];
  [key: string]: any;
}

export type questionField = {
  key: any;
};

export type Field = FieldType & {
  validations?: Validation[];
  answers?: Answer[];
  childAnswers?: Answer[];
  identifier?: string;
  type: string;
  size?: number;
  maxFileUploads?: number;
  fields?: Field[];
  hideChildrenOnSelect?: string;
  min?: number;
  max?: number;
  isEqualTo?: string;
  subApiDataKey?: string;
  name?: string;
};

export type Question = {
  'question-identifier'?: string;
  identifier: string;
  fields: Field[];
};

export type QuestionAnswerAnswer = {
  identifier: string;
  answer: string | File;
};

export type QuestionAnswer = {
  identifier: string;
  answers: QuestionAnswerAnswer[];
};

export type ValidCheck = {
  valid: boolean;
  reason?: string;
};

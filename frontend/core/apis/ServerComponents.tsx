import { QuestionType } from 'core/components/QuestionBuilder';
import AddAnother, { AddAnotherType } from './add-another/AddAnother';
import { answer } from 'core/components/Summary';
import SelectYourOrganisation from './cam/SelectYourOrganisation';
import ConfirmOrganisation from './cam/ConfirmOrganisation';
import ChooseSubmissionTypeContent from 'core/components/ChooseSubmissionTypeContent';
import { ApiResponseDataType } from 'core/validation/types';
import GenerationSuccessful from './common/GenerationSuccessful';
import NewDataRequired from './common/NewDataRequired';
import GetMAH from './pl/TailorYourApplication/GetMAH';
import OrganisationAddressRadios, {
  OrgAddressRadiosType,
} from './pl/TailorYourApplication/GetOrganisationAddress';
import GetParagraph from './pl/TailorYourApplication/GetParagraph';
import ProcedureRadios, {
  ProcedureRadiosType,
} from './pl/TailorYourApplication/ProcedureType';
import * as session from 'core/models/redis';
import { ErrorSummaryType } from 'core/components/ErrorSummary';
import AddContacts from './cam/contacts/AddContactsWrapper';
import GetOrganisationTypeRadios from './common/GetOrganisationType';
import GetOrganisationClassificationSelect from './common/GetOrganisationClassification';
import GetOrganisationCountrySelect from './common/GetOrganisationCountry';
import PreviousNames from './cam/previous-names/PreviousNamesWrapper';

export type ServerComponentType =
  | ServerComponentWithFields
  | ServerComponentNoFields;

type ServerComponentNoFields = {
  type: 'server-component';
  identifier: string;
  section: string;
  rule:
    | 'mah'
    | 'getParagraph'
    | 'select-organisation'
    | 'confirm-organisation'
    | 'chooseSubmissionType'
    | 'getOrganisationName'
    | 'generationSuccessful'
    | 'new-data-required'
    | 'add-contacts'
    | 'getOrganisationType'
    | 'getOrganisationClassification'
    | 'getOrganisationCountry'
    | 'org-previous-names';

  apiKey?: string[];
  apiEndPoint?: string;
  useFor?: string;
  newDataRequiredHeading?: string;
  newDataRequiredContent?: string;
  apiDataKey?: string;
};

type ServerComponentWithFields =
  | AddAnotherType
  | ProcedureRadiosType
  | OrgAddressRadiosType;

export interface DataFieldType {
  type: 'server-component';
  identifier: string;
  section: string;
  rule: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}
type Nullable<T> = T | undefined;

async function ServerComponent({
  question,
  previousPageAnswers,
  searchParams,
  apiData,
}: Readonly<{
  question: Nullable<QuestionType>;
  previousPageAnswers: answer[];
  searchParams?: { [key: string]: string | string[] | undefined };
  companyName?: string;
  apiData?: ApiResponseDataType;
  useFor?: string;
}>) {
  const serverFields = question?.fields?.filter(
    field => field.type == 'server-component',
  ) as ServerComponentType[];

  const errorSummary = (await session.get('errorSummary')) as ErrorSummaryType;
  await session.set('errorSummary', '');

  return (
    <>
      {serverFields?.map((field, index) => {
        switch (field.rule) {
          case 'mah':
            return <GetMAH key={index} />;
          case 'procedure-type-radios':
            return <ProcedureRadios key={index} field={field.fields[0]} />;
          case 'add-another':
            return (
              <AddAnother
                key={index}
                previousAnswers={previousPageAnswers}
                field={field.fields[0]}
                apiData={apiData}
                errorSummary={errorSummary}
              />
            );
          case 'getParagraph':
            return <GetParagraph key={index} field={field} />;
          case 'select-organisation':
            return (
              <SelectYourOrganisation
                key={index}
                searchParams={searchParams}
                identifier={field.identifier}
              />
            );
          case 'confirm-organisation':
            return <ConfirmOrganisation key={index} />;
          case 'chooseSubmissionType':
            return <ChooseSubmissionTypeContent apiData={apiData} />;
          case 'organisation-address':
            return (
              <OrganisationAddressRadios
                field={field.fields[0]}
                previousPageAnswers={previousPageAnswers}
                apiData={apiData}
              />
            );
          case 'generationSuccessful':
            return <GenerationSuccessful useFor={field.useFor ?? ''} />;
          case 'new-data-required':
            return (
              <NewDataRequired
                detailsHeading={field.newDataRequiredHeading ?? ''}
                content={field.newDataRequiredContent ?? ''}
                apiData={apiData}
                apiDataKey={field.apiDataKey}
                identifier={field.identifier}
                useFor={field.useFor ?? ''}
              />
            );
          case 'add-contacts':
            return <AddContacts field={field} key={field.identifier} />;
          case 'getOrganisationType':
            return <GetOrganisationTypeRadios key={index} />;
          case 'getOrganisationClassification':
            return <GetOrganisationClassificationSelect key={index} />;
          case 'getOrganisationCountry':
            return <GetOrganisationCountrySelect key={index} />;
          case 'org-previous-names':
            return <PreviousNames field={field} key={field.identifier} />;
        }
      })}
    </>
  );
}

export default ServerComponent;

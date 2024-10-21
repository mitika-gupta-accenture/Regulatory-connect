import { QuestionType } from '../../components/QuestionBuilder';
import organisationLocation from './questions/organisation-location.json';
import organisationLegalStatusUk from './questions/organisation-legal-status-uk.json';
import organisationSearch from './questions/organisation-search.json';
import organisationName from './questions/organisation-name.json';
import organisationLegalStatusNonUk from './questions/organisation-legal-status-non-uk.json';
import organisationBillingDetails from './questions/organisation-billing-details.json';
import organisationHeadOfficeAddress from './questions/organisation-head-office-address.json';
import organisationAuthorisedToCommunicate from './questions/organisation-authorised-to-communicate.json';
import organisationBillingAddress from './questions/organisation-billing-address.json';
import organisationSeparateBillingAddress from './questions/organisation-separate-billing-address.json';
import organisationPrimaryBillingContact from './questions/organisation-primary-billing-contact.json';
import organisationPrimaryInvoiceContact from './questions/organisation-primary-invoice-contact.json';
import organisationUploadSupportingDocument from './questions/organisation-upload-supporting-document.json';
import organisationUploadFilesMandatory from './questions/organisation-upload-files-mandatory.json';
import organisationUploadFilesOptional from './questions/organisation-upload-files-optional.json';
import confirmOrganisationDetails from './questions/confirm-organisation-details.json';
import organisationClassification from './questions/organisation-classification.json';
import organisationPreviousNames from './questions/organisation-previous-names.json';

function getQuestionFields(): QuestionType[] {
  let typeList: QuestionType[] = [];

  typeList = typeList.concat(
    organisationLocation as QuestionType[],
    organisationLegalStatusNonUk as QuestionType[],
    organisationSearch as QuestionType[],
    organisationName as QuestionType[],
    organisationLegalStatusUk as QuestionType[],
    organisationBillingDetails as QuestionType[],
    organisationHeadOfficeAddress as QuestionType[],
    organisationAuthorisedToCommunicate as QuestionType[],
    organisationBillingAddress as QuestionType[],
    organisationSeparateBillingAddress as QuestionType[],
    organisationPrimaryBillingContact as QuestionType[],
    organisationPrimaryInvoiceContact as QuestionType[],
    organisationUploadSupportingDocument as QuestionType[],
    organisationUploadFilesMandatory as QuestionType[],
    organisationUploadFilesOptional as QuestionType[],
    confirmOrganisationDetails as QuestionType[],
    organisationClassification as QuestionType[],
    organisationPreviousNames as QuestionType[],
    // organisationAppointedPerson as unknown as QuestionType[],
  );

  return typeList;
}

export const questions = getQuestionFields();

export default questions;

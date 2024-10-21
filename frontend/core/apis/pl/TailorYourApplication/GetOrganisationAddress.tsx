'use server';
import FieldFactory from 'core/components/FieldFactory';
import { RadioFieldType } from 'core/components/Radio';
import { Answer } from 'core/validation/types';
import { answer } from 'core/components/Summary';

export interface OrgAddressRadiosType {
  type: 'server-component';
  identifier: string;
  section: string;
  rule: 'organisation-address';
  fields: RadioFieldType[];
}

export interface AddressType {
  [key: string]: any;
}

export default async function OrganisationAddressRadios({
  field,
  previousPageAnswers,
  apiData,
}: {
  field: RadioFieldType;
  previousPageAnswers: answer[];
  apiData?: AddressType;
}) {
  const errorSummary = { title: 'There is a problem', errors: [] };
  let answers: Answer[] = [];
  const isAPIDataAvailable =
    field?.apiDataKey && apiData?.[field.apiDataKey]
      ? apiData?.[field.apiDataKey]
      : [];
  if (isAPIDataAvailable) {
    isAPIDataAvailable?.map((address: AddressType) => {
      answers = [
        ...answers,
        {
          label: address?.name ?? '',
          value: address?.identifier?.toString() ?? '',
          hint: `${address?.addressLine1}, ${address?.city}, ${address?.postalcode}, ${address?.country}`,
          route: '',
        },
      ];
    });
  }
  return (
    <FieldFactory
      field={{
        ...field,
        answers,
      }}
      errorSummary={errorSummary}
      previousAnswer={
        previousPageAnswers
          ? previousPageAnswers.filter(
              answer => answer.identifier === field?.identifier,
            )[0]?.answer
          : ''
      }
      allPreviousAnswers={previousPageAnswers}
    />
  );
}

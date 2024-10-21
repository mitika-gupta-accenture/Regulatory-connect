import React from 'react';
import {
  Details,
  InsetText,
  Label,
  Panel as PanelLib,
  UnorderedList,
} from '@mhra/mhra-design-components';
import Link from 'next/link';
import * as session from 'core/models/redis';
import PLLicenceNumberSummary from 'core/apis/generate-licence-number/LicenceNumberSummary';
import DownloadCSVLink from 'core/components/DownloadCsvLink';
import { questionObj } from '../pl/TailorYourApplication/ProcedureType';
import { RefApiResponseType } from 'core/models/apiModel';
import { ApiResponseDataType } from 'core/validation/types';

interface GenerationSuccessfulProps {
  useFor: string;
}

export interface RefDossierType{
  identifier:number;
  name:string;
}

/**
 * Extracts the application type prefix from the provided data and generates the correct filename prefix.
 *
 * @param {string[]} data - The array of PL numbers.
 * @return {string} The prefix to be used for the filename.
 */
export const getPrefix = (data: string[]): string => {
  if (!data.length) return 'N/A';

  const [firstItem] = data;
  const [applicationType, singleNumber] = firstItem
    .split(' ')
    .map(part => part.trim().replace(/\s+/g, '_'));
  const appLicenceType = applicationType === 'PLPI' ? 'plpi' : 'pl';
  return data.length === 1
    ? `${applicationType}_${singleNumber}`
    : `${appLicenceType}_numbers`;
};

export async function getApiData(useFor: string): Promise<ApiResponseDataType> {
  const data = (await session.get(useFor)) as ApiResponseDataType;
  return data;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const pad = (number: number): string => number.toString().padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
};

const getDossierType=async ()=>{
  const appTypeAnswer = (await session.getAnswer(
    'which-type-of-dossier-id-do-you-want-to-generate',
  )) as questionObj;

  const appType = appTypeAnswer?.answers
  .filter(a => {
    return a.identifier === 'dossierTypeIdentifier';
  })
  .map(a => a.answer)[0];
    const refAns = (await session.get(
      'refData_GET_PL_DOSSIER_ID',
    )) as RefApiResponseType; 
    const result = refAns?.dossierType.filter((i:RefDossierType)=> String(i.identifier) === appType)
    await session.set('clearDossierId',true)
    return result?.[0]?.name;
}
const GenerationSuccessful: React.FC<GenerationSuccessfulProps> = async ({
  useFor,
}) => {
  const apiData = await getApiData(useFor);
  const plNumbersList = apiData?.mhraRiIds ?? [];
  const serverDate: string = formatDate(plNumbersList[0]?.createdTime) ?? '';
  const numberOfPlNumbers: number = plNumbersList.length;
  const plNumbers: string[] = Array.isArray(plNumbersList)
    ? plNumbersList.map(item => item.name)
    : [];
  await session.set('MhraRIId', plNumbers);
  const prefix = getPrefix(plNumbers);
  const filePrefix = `${prefix}_${serverDate}`.trim();
  await session.set('filePrefix', filePrefix);
  const dossierID = apiData?.dossierId?.[0]?.name ?? 'N/A';
  const dossierType = await getDossierType();
  const linkContent = (
    <>
      <Link
        href="/choose-submission-type"
        className="govuk-link"
        id="choose-submission-link"
      >
        Return to Choose submission type
      </Link>
      <div className="govuk-!-margin-top-4">
        <Link href="#" className="govuk-link" id="return-to-applications">
          Return to Applications
        </Link>
      </div>
    </>
  );

  return (
    <>
      <PanelLib title="Generation successful">
        {useFor === 'POST_PL_NUMBER_GENERATION' && (
          <>
            {numberOfPlNumbers > 1 ? (
              <div
                id="multiple-licence-numbers"
                className="govuk-!-font-weight-regular govuk-!-font-size-36 govuk-!-margin-top-6 govuk-panel--confirmation"
              >
                You have successfully generated
                <br />
                <span className="govuk-!-font-weight-bold">{`${numberOfPlNumbers} `}</span>
                licence numbers
              </div>
            ) : (
              <div
                id="single-licence-number"
                className="govuk-!-font-weight-regular govuk-!-font-size-36 govuk-!-margin-top-6 govuk-panel--confirmation"
              >
                Your licence number
                <br />
                <span className="govuk-!-font-weight-bold">{`${plNumbers[0] ?? 'N/A'}`}</span>
              </div>
            )}
          </>
        ) }
        {useFor === 'POST_PL_GENERATE_DOSSIER_ID' && (
          <div className="govuk-!-font-weight-regular govuk-!-font-size-36 govuk-!-margin-top-6 govuk-panel--confirmation">
            Your {`${dossierType === 'Product licence' || dossierID.startsWith('D') ? 'product licence': 'Master File'}`} dossier ID
            <br />
            <span className="govuk-!-font-weight-bold">{`${dossierID ?? 'N/A'}`}</span>
          </div>
        )}
      </PanelLib>

      {useFor === 'POST_PL_NUMBER_GENERATION' && (
        <>
          <div className="govuk-!-margin-top-5">
            <Label text="Licence number details" />
            <PLLicenceNumberSummary title={''} isSuccessPage={true} />
          </div>
          {numberOfPlNumbers > 1 && (
            <Details heading="Your licence numbers">
              <UnorderedList listItems={plNumbers} />
            </Details>
          )}
          <DownloadCSVLink />
          <div className="govuk-!-margin-top-6">
            <InsetText>
              Remember to include the same licence numbers on all documents for
              the same application.
            </InsetText>
          </div>
          <div className="govuk-!-margin-top-9">
            <Link
              href="select-application-type"
              className="govuk-button"
              id="generate-another-id-link"
              role='button'
            >
                Generate another number
            </Link>
          </div>
          {linkContent}
          <div className="govuk-!-margin-top-9">
            <Link
              href="https://regulatoryconnect.mhra.gov.uk/contactmhra"
              className="govuk-link"
              id="contact-mhra"
              target="_blank"
            >
              Is this page not working properly (opens in new tab)?
            </Link>
          </div>
        </>
      )}
      {useFor === 'POST_PL_GENERATE_DOSSIER_ID' && (
        <>
          <div className="govuk-!-padding-top-6">
            <Link
              href="/generate-dossier-id/which-type-of-dossier-id-do-you-want-to-generate"
              className="govuk-link"
              id="generate-another-id-link"
            >
              Generate another dossier ID
            </Link>
          </div>
          <div className="govuk-!-padding-top-4">{linkContent}</div>
        </>
      )}
    </>
  );
};

export default GenerationSuccessful;

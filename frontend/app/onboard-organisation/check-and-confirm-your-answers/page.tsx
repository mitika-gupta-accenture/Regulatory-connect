import React from 'react';
import { AnswersType } from 'core/components/Summary';
import { getAllAnswersAction } from 'app/actions';
import Button from 'core/components/Button';
import Link from 'next/link';

//doesnt do anything yet
import { GridCol, GridRow, GridWrapper } from '@mhra/mhra-design-components';
import { submitOnboardOrganisation } from '../actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function getAnswerValue(
  answers: AnswersType[],
  questionId: string,
  answerId: string,
) {
  return (
    answers
      .find(a => a.identifier === questionId)
      ?.answers?.find(a => a.identifier === answerId)?.answer ?? '-'
  );
}

function getAddressLines(answers: AnswersType[]): string[] {
  // TODO: Code to get companies house data address first, then fall back to manual entry
  const addressQuestion = answers.find(
    a => a.identifier === 'organisation-head-office-address',
  );
  return addressQuestion?.answers.map(a => a.answer).filter(a => !!a) ?? [];
}

function getContacts(answers: AnswersType[], primary: boolean): string[] {
  const answerJson = getAnswerValue(
    answers,
    'organisation-authorised-to-communicate',
    'organisation-contacts',
  );
  const answerVal = JSON.parse(answerJson) as {
    email: string;
    isPrimary: boolean;
  }[];
  return answerVal.filter(x => x.isPrimary === primary).map(x => x.email);
}

function addressLinesToJsx(lines: string[]) {
  return lines.map((l, ix) => {
    if (ix !== 0) {
      return (
        <React.Fragment key={ix}>
          <br />
          {l}
        </React.Fragment>
      );
    }
    return <React.Fragment key={ix}>{l}</React.Fragment>;
  });
}

function billingAddress(answers: AnswersType[]) {
  const isSameAsHeadOffice =
    getAnswerValue(
      answers,
      'organisation-billing-address',
      'organisation-billing-address-radios',
    ) === 'Yes';
  if (isSameAsHeadOffice) {
    return addressLinesToJsx(getAddressLines(answers));
  } else {
    const addressLines =
      answers
        .find(a => a.identifier === 'organisation-separate-billing-address')
        ?.answers.map(a => a.answer)
        .filter(a => !!a) ?? [];
    return addressLinesToJsx(addressLines);
  }
}

function getCompanyNumberOrEmpty(answers: AnswersType[]) {
  const isUkOrg =
    getAnswerValue(
      answers,
      'organisation-location',
      'organisation-location-radios',
    ) === 'Yes';
  if (isUkOrg) {
    return 'todo';
  } else {
    return '-';
  }
}

export default async function Page() {
  const answers = (await getAllAnswersAction()) as AnswersType[];

  if (!answers || answers.length === 0) {
    redirect('/onboard-organisation');
  }

  return (
    <GridWrapper>
      <GridRow>
        <GridCol className="two-thirds">
          <span className="govuk-caption-xl">Onboard an organisation</span>
          <h1 className="govuk-heading-xl">Check your answers</h1>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Organisation's legal name
              </dt>
              <dd className="govuk-summary-list__value">
                {getAnswerValue(
                  answers,
                  'organisation-name',
                  'organisation-name-text',
                )}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Organisation status</dt>
              <dd className="govuk-summary-list__value">
                {getAnswerValue(
                  answers,
                  'organisation-type',
                  'organisation-type-radios',
                )}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Head office address</dt>
              <dd className="govuk-summary-list__value">
                {addressLinesToJsx(getAddressLines(answers))}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Company registration number (only for commercial companies)
              </dt>
              <dd className="govuk-summary-list__value">
                {getCompanyNumberOrEmpty(answers)}
              </dd>
            </div>
          </dl>
          <h2 className="govuk-heading-m">Primary communication contact</h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {getContacts(answers, true).map(c => (
              <div className="govuk-summary-list__row" key={c}>
                <dt className="govuk-summary-list__key">Email</dt>
                <dd className="govuk-summary-list__value">{c}</dd>
              </div>
            ))}
          </dl>
          <h2 className="govuk-heading-m">
            Secondary communication contact(s)
          </h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {getContacts(answers, false).map(c => (
              <div className="govuk-summary-list__row" key={c}>
                <dt className="govuk-summary-list__key">Email</dt>
                <dd className="govuk-summary-list__value">{c}</dd>
              </div>
            ))}
          </dl>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Billing address</dt>
              <dd className="govuk-summary-list__value">
                {billingAddress(answers)}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Primary billing contact
              </dt>
              <dd className="govuk-summary-list__value">
                {getAnswerValue(
                  answers,
                  'organisation-primary-billing-contact',
                  'organisation-primary-billing-contact-email-text',
                )}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Primary invoice contact
              </dt>
              <dd className="govuk-summary-list__value">
                {getAnswerValue(
                  answers,
                  'organisation-primary-invoice-contact',
                  'organisation-primary-invoice-contact-email-text',
                )}
              </dd>
            </div>
          </dl>
          <form action={submitOnboardOrganisation}>
            <Button
              type="submit"
              name="confirm-submit-button"
              disabled={false}
              text={'Confirm and continue'}
            />
          </form>
          <Link href="/cancel-application">
            <button
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
            >
              Cancel application
            </button>
          </Link>
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

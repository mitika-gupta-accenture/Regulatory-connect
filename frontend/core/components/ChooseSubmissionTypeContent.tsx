'use client';
import React from 'react';
import Link from 'next/link';
import {
  GridRow,
  GridCol,
  Heading,
  UnorderedList,
  Caption,
} from '@mhra/mhra-design-components';
import Paragraph from 'core/components/Paragraph';
import { ApiResponseDataType } from 'core/validation/types';

interface LinkItem {
  id: number;
  linkDisplayText: string;
  linkURL: string;
}

export interface SubmissionType {
  id: number;
  submissionTypeHeader: string;
  submissionTypeSubHeader?: string;
  guidelineLinkDisplayText: string;
  guidelineURL: string;
  link: LinkItem[];
}

export interface SubmissionDataType {
  submissionType?: SubmissionType[];
  [key: string]: any;
}

interface ChooseSubmissionTypeContentProps {
  submissionData?: SubmissionDataType;
}

const ListItems: React.FC<{ links: LinkItem[] }> = ({ links }) => (
  <UnorderedList
    listItems={links.map(linkItem => (
      <Link
        key={linkItem.id}
        className="govuk-link govuk-submissionType-links"
        href={
          linkItem.linkURL.includes('www.')
            ? `https://${linkItem.linkURL}`
            : linkItem.linkURL
        }
        id={linkItem.linkDisplayText}
        target={
          linkItem.linkDisplayText.includes('opens in new tab')
            ? '_blank'
            : '_self'
        }
      >
        {linkItem.linkDisplayText}
      </Link>
    ))}
    className="govuk-list--spaced"
  />
);

const SubmissionTypeSection: React.FC<{ submission: SubmissionType }> = ({
  submission,
}) => (
  <div className="govuk-!-margin-bottom-7">
    <Heading text={submission.submissionTypeHeader} level={2} size="m" />
    {submission?.submissionTypeSubHeader && (
      <Paragraph
        field={{
          content: [submission?.submissionTypeSubHeader],
          identifier: submission.submissionTypeHeader,
          type: 'paragraph',
        }}
      />
    )}
    <ListItems links={submission.link} />
    <Link
      className="govuk-link govuk-!-font-weight-bold govuk-list"
      href={
        submission.guidelineURL.includes('www.')
          ? `https://${submission.guidelineURL}`
          : submission.guidelineURL
      }
      id={submission.guidelineLinkDisplayText}
      target={'_blank'}
    >
      {submission.guidelineLinkDisplayText}
    </Link>
  </div>
);
const ChooseSubmissionTypeContent: React.FC<ApiResponseDataType> = ({
  apiData,
}) => {
  const submissionData: SubmissionDataType = apiData?.attributes ?? [];
  const companyName: string =
    apiData?.microsoftUserDetails?.selectedOrganisation?.name;
  return (
    <>
      <GridRow className="govuk-!-padding-left-0">
        <GridCol className="govuk-!-padding-left-0">
          <Heading
            text={'Choose a submission type'}
            className="govuk-!-margin-bottom-6 govuk-!-padding-left-0"
          >
            <Caption text={companyName} />
          </Heading>
        </GridCol>
      </GridRow>
      {submissionData && (
        <GridRow>
          <GridCol className="one-half govuk-!-padding-left-0">
            {submissionData.submissionType?.map(
              (submission: any, index: number) => (
                <React.Fragment key={submission.id}>
                  {index % 2 == 0 && (
                    <SubmissionTypeSection submission={submission} />
                  )}
                </React.Fragment>
              ),
            )}
          </GridCol>
          <GridCol className="one-half govuk-!-padding-left-0">
            {submissionData?.submissionType?.map(
              (submission: any, index: number) => (
                <React.Fragment key={submission.id}>
                  {index % 2 !== 0 && (
                    <SubmissionTypeSection submission={submission} />
                  )}
                </React.Fragment>
              ),
            )}
          </GridCol>
        </GridRow>
      )}
    </>
  );
};
export default ChooseSubmissionTypeContent;

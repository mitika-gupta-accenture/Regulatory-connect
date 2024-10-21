import questions from '../../../core/fields/pl/tailor-your-application/index';
import QuestionBuilder from '../../../core/components/QuestionBuilder';
import Summary, { AnswersType } from '../../../core/components/Summary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import * as session from '../../../core/models/redis';
import _ from 'lodash';
import BackButton from 'core/util/BackButton';
import { getAllAnswersAction, getPageTitle } from 'app/actions';
import { UploadFile } from 'core/models/file';
import ServerComponent from 'core/apis/ServerComponents';
import { continuePlTailorYourAppForm } from '../actions';
import ScrollToTop from 'core/components/ScrollToTop';
import { Heading } from '@mhra/mhra-design-components';
import { ApiResponseDataType } from 'core/validation/types';
import { retrieveApiData } from 'core/util/retrieveApiData';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return questions;
}

async function getCurrentPage(identifier: string) {
  return questions.find(question => question.identifier === identifier);
}

type Props = {
  params: { identifier: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { identifier } = params;
  const question = await getCurrentPage(identifier);
  return getPageTitle(question);
}

export default async function Page({ params, searchParams }: Props) {
  const cookiesList = cookies();
  const cookieCheck = cookiesList.get('cookie_check')?.value;
  const sessionUUID = cookiesList.get('session_cookie')?.value;

  if (!cookieCheck) {
    redirect('/no-cookies');
  }

  if (!sessionUUID) {
    redirect('/session-expired');
  }

  const { identifier } = params;

  const question = await getCurrentPage(identifier);
  const currentRoute = question?.identifier;
  const questionInfo = currentRoute
    ? await session.getAnswer<AnswersType>(currentRoute)
    : await Promise.resolve(null);

  const previousPageAnswers = questionInfo ? questionInfo.answers : [];

  const allAnswers = await getAllAnswersAction();

  const allFiles = await session.getFiles();

  const files = allFiles.filter(
    (file: UploadFile) => file.identifier === currentRoute,
  );

  const deleteFileId = _.get(searchParams, '[delete-file]');

  const apiGroupNames = question?.apiGroupName ? [question.apiGroupName] : null;
  const apiData: ApiResponseDataType =
    apiGroupNames !== null ? await retrieveApiData(apiGroupNames) : {};

  if (deleteFileId) {
    await session.deleteFile(deleteFileId);
    redirect(currentRoute!);
  }

  if (currentRoute?.includes('review-and-submit')) {
    // User navigated back after the confirmation page
    if (allAnswers.length === 0) {
      redirect('/');
    }

    return (
      <>
        <ScrollToTop />
        <BackButton />
        <Heading
          className="govuk-heading-l"
          id="summary-heading"
          text={''}
          size="l"
        >
          {question?.question}
        </Heading>
        <Summary answers={allAnswers} formPath="tailor-your-application" />
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          apiData={apiData}
          serverAction={continuePlTailorYourAppForm}
        />
      </>
    );
  } else if (question) {
    return (
      <>
        <ScrollToTop />
        <BackButton />
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          apiData={apiData}
          serverAction={continuePlTailorYourAppForm}
          serverComponent={
            <ServerComponent
              question={question}
              previousPageAnswers={previousPageAnswers}
              apiData={apiData}
            />
          }
        />
      </>
    );
  }
}

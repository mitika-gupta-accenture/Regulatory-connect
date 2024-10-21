import questions from '../../../core/fields/pl/generate-licence-number/index';
import QuestionBuilder from '../../../core/components/QuestionBuilder';
import Summary, { AnswersType } from '../../../core/components/Summary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import * as session from '../../../core/models/redis';
import _ from 'lodash';
import BackButton from '../../../core/util/BackButton';
import { getAllAnswersAction, getPageTitle } from 'app/actions';
import { UploadFile } from '../../../core/models/file';
import ServerComponent from '../../../core/apis/ServerComponents';
import { continueGenerateLicenceForm } from '../actions';
import { ApiResponseDataType } from 'core/validation/types';
import { retrieveApiData } from 'core/util/retrieveApiData';
import ScrollToTop from 'core/components/ScrollToTop';

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
  const isGenerationSuccessful: boolean =
    question?.identifier === 'generation-successful';
  const title = isGenerationSuccessful
    ? { title: 'Generation Successful' }
    : await getPageTitle(question);
  return title;
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
  const apiGroupNames = question?.apiGroupName ? [question.apiGroupName] : null;
  const apiData: ApiResponseDataType =
    apiGroupNames !== null ? await retrieveApiData(apiGroupNames) : {};
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
        {identifier !== 'generation-successful' && <BackButton />}
        <h1 className="govuk-heading-l" id="summary-heading">
          {question?.question}
        </h1>
        <Summary answers={allAnswers} formPath={'generate-licence-number'} />
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          apiData={apiData}
          serverAction={continueGenerateLicenceForm}
        />
      </>
    );
  } else if (question) {
    return (
      <>
        <ScrollToTop />
        {identifier !== 'generation-successful' && <BackButton />}
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          apiData={apiData}
          serverAction={continueGenerateLicenceForm}
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

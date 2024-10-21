import questions from '../../../core/fields/onboard-organisation/index';
import QuestionBuilder, {
  QuestionType,
} from '../../../core/components/QuestionBuilder';
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
import { continueOnboardOrganisationForm } from '../actions';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return questions;
}

async function getCurrentPage(identifier: string) {
  return questions.find(question => question.identifier === identifier);
}

async function getPreviousPage(question: QuestionType) {
  const steps = await session.get<Array<string>>('steps');
  const currentRouteIndex = _.indexOf(
    steps,
    `/onboard-organisation/${question?.identifier}`,
    0,
  );
  const stepBeforeIndex = currentRouteIndex > 0 ? currentRouteIndex - 1 : 0;
  const previousPage = steps ? steps[stepBeforeIndex] : '';
  return previousPage;
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

  const steps = (await session.get<Array<string>>('steps')) || [
    '/onboard-organisation/check-onboarding-status',
  ];

  steps.push(`/onboard-organisation/${currentRoute}`);

  await session.set('steps', _.uniq(steps));
  const allFiles = await session.getFiles();

  const files = allFiles.filter(
    (file: UploadFile) => file.identifier === currentRoute,
  );

  const previousPage =
    (await getPreviousPage(question!)) ||
    '/onboard-organisation/check-onboarding-status';

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
        <BackButton previousPage={previousPage} />
        <h1 className="govuk-heading-l" id="summary-heading">
          {question?.question}
        </h1>
        <Summary answers={allAnswers} formPath={'onboard-organisation'} />
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          serverAction={continueOnboardOrganisationForm}
        />
      </>
    );
  } else if (question) {
    return (
      <>
        <BackButton previousPage={previousPage} />
        <QuestionBuilder
          question={question}
          previousPageAnswers={previousPageAnswers}
          files={files}
          serverAction={continueOnboardOrganisationForm}
          serverComponent={
            <ServerComponent
              question={question}
              previousPageAnswers={previousPageAnswers}
              searchParams={searchParams}
            />
          }
        />
      </>
    );
  }
}

import * as session from '../../core/models/redis';
import QuestionBuilder from 'core/components/QuestionBuilder';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ScrollToTop from 'core/components/ScrollToTop';
import BackButton from 'core/util/BackButton';
import { UploadFile } from 'core/models/file';
import ServerComponent from 'core/apis/ServerComponents';
import { Metadata } from 'next';
import { retrieveApiData } from 'core/util/retrieveApiData';
import { ApiResponseDataType } from 'core/validation/types';
import questions from 'core/fields/choose-submission-type';
import { clearOnlyAnswers } from 'core/apis/common/clearOnlyAnswers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Choose a submission type',
  };
}
const ChooseSubmissionTypePage = async () => {
  await clearOnlyAnswers();
  const cookiesList = cookies();
  const cookieCheck = cookiesList.get('cookie_check')?.value;
  const sessionUUID = cookiesList.get('session_cookie')?.value;

  if (!cookieCheck) {
    redirect('/no-cookies');
  }

  if (!sessionUUID) {
    redirect('/session-expired');
  }
  const question = questions[0];

  const allFiles = await session.getFiles();
  const currentRoute = question.identifier;
  const files = allFiles.filter(
    (file: UploadFile) => file.identifier === currentRoute,
  );

  const apiData = (await retrieveApiData([
    'CMS_GET_CHOOSE_SUBMISSION_TYPE',
  ])) as ApiResponseDataType;

  return (
    <>
      <ScrollToTop />
      <BackButton />
      <QuestionBuilder
        question={question}
        previousPageAnswers={[]}
        files={files}
        apiData={apiData}
        serverAction={{}}
        layout={'full govuk-!-padding-0'}
        serverComponent={
          <ServerComponent
            question={question}
            previousPageAnswers={[]}
            apiData={apiData}
          />
        }
      />
    </>
  );
};

export default ChooseSubmissionTypePage;

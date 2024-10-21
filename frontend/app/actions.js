'use server';

import { redirect } from 'next/navigation';
import { determineRoute } from './convertQuestionConditions';
import { revalidatePath } from 'next/cache';
import * as session from '../core/models/redis';
import { validate as validatorValidate } from '../core/validation/validator';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { sendNotifications } from './sendNotifications';
import { getFields } from '../core/util/getFields';
import { processFileAnswer, removeFiles } from './processFileAnswer';
import sufficientInformationProvided from '../core/util/sufficientInformationProvided';
import { apiService } from 'core/services/apiService';
import {
  findUnreachableNodes,
  getNextEmptyNode,
  questionGraph,
} from '../core/util/graph';
import {
  isFileUploadQuestion,
  shouldHaveFiles,
} from '../core/util/questionUtils';
import { forEachAsync } from '../core/util/arrayUtils';
import { clearOnlyAnswers } from 'core/apis/common/clearOnlyAnswers';

export async function getAllAnswersAction() {
  return await session.getAllAnswers();
}

export async function submitAnswers(prevState, formPath) {
  // submission for generic application
  await session.getAllAnswers();
  redirect(`/${formPath}/application-complete`);
}

export async function invokePostApiOnSubmit(postApiGroupName) {
  if (postApiGroupName !== null) {
    try {
      const data = await apiService(postApiGroupName);
      await session.set(postApiGroupName, data);
    } catch (error) {
      console.error(`Failed to fetch data for ${postApiGroupName}`);
      throw new Error(
        `Failed to fetch data for group name : ${postApiGroupName}`,
      );
    }
  }
}

export const cancelApplication = async () => {
  await clearOnlyAnswers();
  redirect(`/choose-submission-type`);
};

export const cancelOnboardOrganisation = async () => {
  await clearOnlyAnswers();
  redirect(`/onboard-organisation`);
};

export const cancelUserRegistrationApplication = async () => {
  await clearOnlyAnswers();
  redirect(`/`);
};

//saves the current form to redis, determines and routes to next path, performs validation against current question
export async function saveForm(
  prevState,
  queryData,
  formPath,
  questionJson,
  postApiGroupName,
) {
  const question = prevState.question;
  const errorSummary = prevState.errorSummary;
  const formState = await session.getFullFormState();
  const answers = await getFields(prevState.question, queryData, formState);
  let route = getNextRoute(answers, question);
  //pushes answers and identifiers for the current question
  const questionObj = {
    question: question.question,
    sectionName: question.sectionName,
    answers: answers,
    nextRoute: route,
    identifier: question.identifier,
  };

  const fileUpload = answers.find(
    answer => answer.identifier === 'upload-screenshots',
  );

  const allFiles = await session.getFiles();
  const currentFileNumber = allFiles.filter(
    file => file.identifier === question.identifier,
  ).length;

  await Promise.all(
    question.fields.map(async field => {
      if (field?.rule === 'add-another') {
        const stateField = await session.getFormState(
          field.fields[0].identifier,
        );
        stateField.forEach(
          (item, idx) =>
            (stateField[idx] = {
              ...item,
              value: queryData.get(item?.identifier),
            }),
        );
        await session.setFormState(field.fields[0].identifier, stateField);
        field.fields = [stateField];
        let extractField = (field.fields = stateField);
        return extractField;
      }
    }),
  );
  let validationErrors = [...new Set(validatorValidate(question, questionObj))];
  if (currentFileNumber > 0) {
    validationErrors = validationErrors.filter(
      error => !error.isFileValidation || error.reason !== 'required',
    );
  }

  if (!validationErrors.length) {
    await session.setAnswer(question.identifier, questionObj);
    const isUploadPage = isFileUploadQuestion(question);
    await session.set('errorForTitle', '');
    await session.set('errorSummary', '');

    await removeUnreachableAnswers(questionJson);

    if (_.get(fileUpload, 'answer.size')) {
      await processFileAnswer(question.identifier, fileUpload.answer);
    } else if (isUploadPage && !shouldHaveFiles(questionObj, question)) {
      await removeFiles(question.identifier);
    }

    if (postApiGroupName) {
      await invokePostApiOnSubmit(postApiGroupName);
    }
    //ROUTING HERE
    const answersArr = await session.getAllAnswers();
    await navigateToNextRoute(
      route,
      answersArr,
      queryData,
      questionJson,
      formPath,
    );
  }

  errorSummary.errors = validationErrors;
  showErrorMsgOnPageTitle(errorSummary, question);
  await session.set('errorSummary', errorSummary);
  // recaches client component when client side turned on to expose validation error when staying on page
  revalidatePath(question.identifier);

  return {
    question: question,
    answers: await session.getAllAnswers(),
    errorSummary,
  };
}
const showErrorMsgOnPageTitle = async (errorSummary, question) => {
  if (errorSummary.errors.length > 0) {
    await session.set('errorForTitle', `Error: ${question.question}`);
  } else {
    await session.set('errorForTitle', '');
  }
};

export async function getPageTitle(question) {
  const errorForTitle = await session.get('errorForTitle');
  if (errorForTitle && errorForTitle !== '') {
    await session.set('errorForTitle', '');
    return { title: errorForTitle };
  }
  return { title: question?.question };
}

async function getAnswersWithCalculatedConditionalRoutes() {
  let answers = await session.getAllAnswers();
  await forEachAsync(answers, async answer => {
    if (answer?.nextRoute?.constructor === Array) {
      let newRoute = await determineRoute(answer?.nextRoute, answers);
      answer.nextRoute = newRoute;
    }
    if (answer?.answers) {
      await forEachAsync(answer.answers, async nestedAnswer => {
        if (nestedAnswer?.route?.constructor === Array) {
          let newRoute = await determineRoute(nestedAnswer?.route, answers);
          nestedAnswer.route = newRoute;
        }
      });
    }
  });

  return answers;
}

async function removeUnreachableAnswers(questionJson) {
  const generatedQuestionGraph = await questionGraph(questionJson);
  const START_NODE_ID = questionJson[0].identifier;
  const answers = await getAnswersWithCalculatedConditionalRoutes();

  const startNode = generatedQuestionGraph.findNodeByDataValue(
    START_NODE_ID,
    x => x.identifier,
  );
  const unreachable = findUnreachableNodes(
    generatedQuestionGraph,
    answers,
    startNode,
  );
  unreachable.forEach(async a => {
    if (answers.filter(answer => answer.identifier === a.identifier)[0]) {
      await removeUnreachableAnswers(questionJson);
    }
    await session.clearAnswer(a.identifier);
  });
}

function getNextRoute(answers, question) {
  const routes = [];
  //gets all of the answers and routes based on all fields for the question
  if (question.route) {
    let nextRoute = question.route;
    routes.push(nextRoute);
  } else {
    for (let i in answers) {
      //pushes all valid routes for current question to an array
      let nextRoute = question?.route ? question?.route : answers[i].route;
      routes.push(nextRoute);
    }
  }

  //gets the first valid route and sets to the main route for navigation
  return _.defaultTo(
    _.find(routes, route => route),
    'complete',
  );
}

async function navigateToNextRoute(
  route,
  answersArr,
  queryData,
  questionJson,
  formPath,
) {
  //checks if the route is an array, if so triggers dynamic routing action, otherwise just sets next route
  if (route?.constructor === Array) {
    route = await determineRoute(route, answersArr);
  }

  if (route === 'complete') {
    const hasSufficientEvidence = sufficientInformationProvided(answersArr);

    if (!hasSufficientEvidence) {
      route = 'insufficientEvidence';
    } else {
      // On confirmation page, generate a reference number and
      // store in session state
      const referenceNumber = uuidv4();
      await session.set('referenceNumber', referenceNumber);
      //send email with all answers
      await sendNotifications(answersArr);

      // final page, clear session but keep 'referenceNumber' for panel
      await session.clear();
      await session.set('referenceNumber', referenceNumber);
    }
  } else {
    // Gets the next unanswered question using the graph
    // Useful in the case a user is changing a previous answer which affects later questions
    route = getNextEmptyNode(
      await questionGraph(questionJson),
      await getAnswersWithCalculatedConditionalRoutes(),
      route,
    );
  }

  const fileUploadComplete = !queryData.get('fileUpload');

  if (fileUploadComplete) {
    redirect(`/${formPath}/${route}`);
  }
}

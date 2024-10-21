'use server';

import { NotifyClient } from 'notifications-node-client';
import _ from 'lodash';
import * as session from '../core/models/redis';
import { get } from '../core/models/redis';

async function sendNotifications(answersArr) {
  const referenceNumber = await get('referenceNumber');

  let notifyAnswers = answersArr
    .map(question => {
      const answer = _.find(question.answers, obj => obj.answer)?.answer;
      return {
        question: question.question,
        answer: answer && _.isEmpty(answer) ? 'Yes' : answer,
      };
    })
    .filter(o => o.answer);

  let imageFiles = await session.getFiles();

  notifyAnswers = notifyAnswers.map(obj => `${obj.question}\n  -${obj.answer}`);
  imageFiles = imageFiles.map(obj => `[${obj.fileName}](${obj.url})`);

  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY || '');

  try {
    await notifyClient.sendEmail(
      process.env.NOTIFY_CASEWORKER_TEMPLATE,
      process.env.NOTIFY_CASEWORKER_EMAIL,
      {
        personalisation: {
          answers: notifyAnswers,
          hasImages: imageFiles.length ? 'yes' : 'no',
          images: imageFiles,
          referenceNumber: referenceNumber,
        },
      },
    );

    const contact = await session.getAnswer('what-are-your-contact-details');
    const email = _.find(
      contact?.answers,
      obj => obj.identifier === 'email-address',
    );

    if (email) {
      await notifyClient.sendEmail(
        process.env.NOTIFY_CITIZEN_RECEIPT,
        email.answer,
        {
          personalisation: {
            referenceNumber: referenceNumber,
          },
        },
      );
    }
  } catch (err) {
    throw _.get(err, 'response.data.errors[0].message', err);
  }
}

export { sendNotifications };

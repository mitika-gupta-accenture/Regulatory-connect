export default function sufficientInformationProvided(answersObjects) {
  return answersObjects.some(answerObject =>
    answerObject?.answers?.some(
      answer =>
        answer?.answer != '' &&
        answer?.answer != 'Something else' &&
        answer?.answer != 'No',
    ),
  );
}

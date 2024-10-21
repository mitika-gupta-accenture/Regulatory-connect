'use client';

import React from 'react';
import Link from 'next/link';
import { AnswersType } from './Summary';

function renderAnswers(answers: AnswersType['answers']) {
  //Below lines will be refactored with dynamic API data once we have the dashboard page developed.

  return answers?.map((element, index) => {
    const content =
      typeof element.label === 'string' && element.label.trim()
        ? element.label
        : typeof element.answer === 'string' && element.answer.trim()
          ? element.answer
          : '';

    return (
      <dd key={`${element.identifier}-${index}`}>
        {content}
        {index < answers.length - 1 && ', '}
      </dd>
    );
  });
}

function renderChangeLinks(
  answers: AnswersType['answers'],
  formPath: string,
  identifier: string,
  question: string,
) {
  return answers?.map(
    (element, index) =>
      element?.showChangeLinkInSummary !== false && (
        <dd
          className="govuk-summary-list__actions"
          key={`${element.identifier}-${index}-change`}
        >
          <Link
            className="govuk-link"
            data-cy={answers}
            href={`/${formPath}/${identifier}`}
            tabIndex={0}
          >
            Change
            <span className="govuk-visually-hidden">{question ?? 'name'}</span>
          </Link>
        </dd>
      ),
  );
}

function SummaryItem({
  question,
  formPath,
}: {
  question: AnswersType;
  formPath: string;
}) {
  const answers = question.answers;
  return (
    answers && (
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">{question.question}</dt>
        <dd className="govuk-summary-list__value">
          <dl className="govuk-summary-list__details">
            {renderAnswers(answers)}
          </dl>
        </dd>
        {renderChangeLinks(
          answers,
          formPath,
          question.identifier,
          question.question,
        )}
      </div>
    )
  );
}

export default SummaryItem;

'use client';
import Button from './Button';
import { useFormState } from 'react-dom';
import FieldFactory, { FieldType } from './FieldFactory';
import ErrorSummary, { ErrorSummaryType } from './ErrorSummary';
import { answer } from './Summary';
import { Conditional } from './Conditional';
import { UploadFile } from 'core/models/file';
import { ApiDataType } from './Autocomplete';
import {
  Caption,
  Fieldset,
  GridCol,
  GridRow,
  GridWrapper,
} from '@mhra/mhra-design-components';
import Link from 'next/link';
import { useEffect } from 'react';

export interface QuestionType {
  sectionName?: string;
  identifier: string;
  question: string;
  fields: FieldType[];
  route?: string;
  buttonText?: string;
  buttonClassName?: string;
  buttonType?: 'warning' | 'secondary';
  buttonTwoText?: string;
  buttonTwoClassName?: string;
  buttonTwoType?: 'warning' | 'secondary';
  showSubmitButton?: boolean;
  isCancelButtonRequired?: boolean;
  isDashboardLinkRequired?: boolean;
  dashboardLinkText?: string;
  dashboardLinkHref?: string;
  showButtonGroupInline?: boolean;
  buttonTwoHref?: string;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  apiGroupName?: string;
}

type Nullable<T> = T | undefined;

export default function QuestionBuilder({
  question,
  files,
  previousPageAnswers,
  serverAction,
  children,
  apiData,
  showSubmitButton = true,
  isCancelButtonRequired = true,
  isDashboardLinkRequired = false,
  showButtonGroupInline = false,
  serverComponent,
  layout = 'two-thirds govuk-!-padding-left-0',
}: {
  question: Nullable<QuestionType>;
  files: UploadFile[];
  previousPageAnswers: answer[];
  serverAction: any;
  children?: React.ReactNode;
  apiData?: ApiDataType | {};
  buttonText?: string;
  buttonClassName?: string;
  buttonType?: 'warning' | 'secondary';
  showSubmitButton?: boolean;
  isCancelButtonRequired?: boolean;
  isDashboardLinkRequired?: boolean;
  dashboardLinkText?: string;
  dashboardLinkHref?: string;
  showButtonGroupInline?: boolean;
  buttonTwoText?: string;
  buttonTwoClassName?: string;
  buttonTwoType?: 'warning' | 'secondary';
  buttonTwoHref?: string;
  serverComponent?: React.ReactNode;
  layout?: string;
}) {
  const [message, formAction] = useFormState(serverAction, {
    question,
    answers: [],
    errorSummary: { title: 'There is a problem', errors: [] },
  });

  const errorSummary: ErrorSummaryType =
    message.errorSummary as ErrorSummaryType;

  useEffect(() => {
    if (errorSummary.errors.length > 0) {
      window.scrollTo(0, 0);
    }
  }, [errorSummary]);
  return (
    <GridWrapper>
      <GridRow>
        <GridCol className={layout}>
          <Conditional showWhen={!!errorSummary.errors?.length}>
            <ErrorSummary errorSummary={errorSummary} />
          </Conditional>

          <form
            action={
              question?.identifier === 'generation-successful'
                ? '/api/generate-csv'
                : formAction
            }
          >
            <Fieldset
              size="l"
              withHeading={true}
              legend={
                question?.sectionName ? (
                  <>
                    <Caption
                      id={`caption-${question?.sectionName}`}
                      size="l"
                      text={question?.sectionName || ''}
                    />
                    {question?.question ?? ''}
                  </>
                ) : (
                  <>{question?.question ?? ''}</>
                )
              }
            ></Fieldset>
            <div
              className={
                'govuk-form-group' +
                (errorSummary.errors?.length ? ' govuk-form-group--error' : '')
              }
            >
              {question?.fields?.map((field, index) => {
                return (
                  <FieldFactory
                    key={index}
                    field={field}
                    errorSummary={errorSummary}
                    files={files}
                    previousAnswer={
                      previousPageAnswers
                        ? previousPageAnswers.filter(
                            answer => answer.identifier == field?.identifier,
                          )[0]?.answer
                        : ''
                    }
                    allPreviousAnswers={previousPageAnswers}
                    serverComponent={serverComponent}
                    apiData={apiData ?? []}
                  >
                    {children}
                  </FieldFactory>
                );
              })}
            </div>

            <div
              className={
                (question?.showButtonGroupInline ?? showButtonGroupInline)
                  ? 'govuk-button-group'
                  : ''
              }
            >
              {(question?.showSubmitButton ?? showSubmitButton) && (
                <Button
                  name={
                    question?.buttonText ? question?.buttonText : 'continue'
                  }
                  disabled={false}
                  buttonType={question?.buttonType}
                  className={question?.buttonClassName}
                  text={
                    question?.buttonText ? question?.buttonText : 'Continue'
                  }
                />
              )}
              <div
                className={
                  (question?.showButtonGroupInline ?? showButtonGroupInline)
                    ? 'govuk-button-group'
                    : ''
                }
              >
                {(question?.isCancelButtonRequired ??
                  isCancelButtonRequired) && (
                  <Link
                    href={
                      question?.buttonTwoHref
                        ? question?.buttonTwoHref
                        : '/cancel-application'
                    }
                    role="button"
                    className={
                      question?.buttonTwoClassName
                        ? question?.buttonTwoClassName
                        : 'govuk-button govuk-button--secondary'
                    }
                  >
                    {question?.buttonTwoText
                      ? question?.buttonTwoText
                      : 'Cancel application'}
                  </Link>
                )}
              </div>
            </div>
          </form>
          {(question?.isDashboardLinkRequired ?? isDashboardLinkRequired) && (
            <Link
              href={question?.dashboardLinkHref || ''}
              className="govuk-link"
            >
              {question?.dashboardLinkText}
            </Link>
          )}
        </GridCol>
      </GridRow>
    </GridWrapper>
  );
}

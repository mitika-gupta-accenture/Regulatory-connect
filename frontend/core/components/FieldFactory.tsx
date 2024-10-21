'use client';

import NotificationBanner, { NotificationFieldType } from './NotificationBanner';
import DateInput, { DateInputFieldType } from './DateInput';
import Hint, { HintFieldType } from './Hint';
import AutoComplete, { ApiDataType, AutocompleteFieldType } from './Autocomplete';
import Heading, { HeadingFieldType } from './Heading';
import Select, { SelectFieldType } from './Select';
import Link, { LinkType } from './Link';
import AccordionWrapper, { AccordionFieldType } from './Accordion';
import InsetText, { InsetFieldType } from './InsetText';
import Label, { LabelFieldType } from './Label';
import Panel, { PanelFieldType } from './Panel';
import { DataFieldType } from 'core/apis/ServerComponents';
import { UploadFile } from 'core/models/file';
import { ReactNode } from 'react';
import Checkbox, { CheckboxFieldType } from './Checkbox';
import Details, { DetailsFieldType } from './Details';
import { ErrorSummaryType } from './ErrorSummary';
import FileUpload, { SingleFileInputFieldType } from './FileUpload';
import Paragraph, { ParagraphFieldType } from './Paragraph';
import Radio, { RadioFieldType } from './Radio';
import Summary, { answer, SummaryListFieldType } from './Summary';
import Tabs, { TabsFieldType } from './Tabs';
import TextArea, { TextAreaInputFieldType } from './TextArea';
import TextInput, { TextInputFieldType } from './TextInput';
import UnorderedListWrapper, { ListFieldType } from './UnorderedList';
import { refDataString } from 'core/util/stringModifier';
import Caption,{CaptionFieldType} from './Caption';

export interface PlainTextFieldType {
  type: 'plainText';
  identifier: string;
  content: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  label?: string;
}

export type SingleInputType =
  | TextInputFieldType
  | TextAreaInputFieldType
  | SingleFileInputFieldType
  | AutocompleteFieldType
  | SelectFieldType
  | InsetFieldType;

export type MultipleInputType = RadioFieldType | CheckboxFieldType;

export type FieldType =
  | SingleInputType
  | MultipleInputType
  | ParagraphFieldType
  | DetailsFieldType
  | DateInputFieldType
  | TabsFieldType
  | DataFieldType
  | ListFieldType
  | NotificationFieldType
  | HintFieldType
  | HeadingFieldType
  | LabelFieldType
  | LinkType
  | SummaryListFieldType
  | PlainTextFieldType
  | PanelFieldType
  | AccordionFieldType 
  | CaptionFieldType;

function FieldFactory({
  field,
  errorSummary,
  previousAnswer,
  files,
  allPreviousAnswers,
  children,
  serverComponent,
  apiData,
}: {
    field: FieldType;
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
  files?: UploadFile[];
  allPreviousAnswers?: answer[];
  children?: ReactNode;
    serverComponent?: React.ReactNode;
  apiData?: ApiDataType | {};
}) {
  switch (field.type) {
    case 'panel':
      return (
        <Panel field={field} apiData={apiData} errorSummary={errorSummary} />
      );
    case 'accordion':
      return <AccordionWrapper field={field} />;
    case 'summaryList':
        return (
          <Summary field={field} formPath={''} apiData={apiData} answers={[]} useForFieldFactory={true} />
    );  
    case 'plainText':
      return (
        <>
          {refDataString(field.content, field.apiDataKey ?? '', apiData ?? '')}
        </>
      );
    case 'text':
      return (
        <TextInput
          field={field}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
        >
          {children}
        </TextInput>
      );
    case 'radio':
      return (
        <Radio
          field={field}
          apiData={apiData}
          files={files}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
          allPreviousAnswers={allPreviousAnswers}
        />
      );
    case 'select':
      return (
        <Select
          field={field}
          apiData={apiData}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
        />
      );
    case 'textarea':
      return (
        <TextArea
          field={field}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
        >
          {children}
        </TextArea>
      );
    case 'checkbox':
      return (
        <Checkbox
          field={field}
          apiData={apiData}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
          allPreviousAnswers={allPreviousAnswers}
        />
      );
    case 'paragraph':
      return <Paragraph field={field} apiData={apiData} />;
    case 'details':
      return (
        <Details
          field={field}
          errorSummary={errorSummary}
          allPreviousAnswers={allPreviousAnswers}
          apiData={apiData}
        />
      );
    case 'tabs':
      return <Tabs field={field} errorSummary={errorSummary} />;
    case 'file':
      return (
        <FileUpload
          field={field}
          files={files!}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
        />
      );
    case 'unorderedlist':
      return (
        <UnorderedListWrapper
          field={field}
          errorSummary={errorSummary}
          apiData={apiData}
        />
      );
    case 'notification-banner':
      return <NotificationBanner field={field} errorSummary={errorSummary} />;
    case 'hint':
      return (
        <Hint field={field} errorSummary={errorSummary} apiData={apiData} />
      );
    case 'heading':
      return (
        <Heading field={field} errorSummary={errorSummary} apiData={apiData} />
      );
    case 'label':
      return (
        <Label field={field} apiData={apiData} errorSummary={errorSummary} />
      );
    case 'server-component':
      return <>{serverComponent}</>;
    case 'date':
      return (
        <DateInput
          field={field}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
        />
      );
    case 'autocomplete':
      return (
        <AutoComplete
          field={field}
          errorSummary={errorSummary}
          previousAnswer={previousAnswer}
          apiData={apiData ?? []}
        />
      );
    case 'link':
      return (
        <Link
          id={field?.id}
          href={field?.href}
          className={field?.className}
          noVisitedState={field?.noVisitedState}
          isInverse={field?.isInverse}
          noUnderline={field?.noUnderline}
          opensInNewTab={field?.opensInNewTab}
          type={field?.type}
          visuallyHiddenText={field?.visuallyHiddenText}
        >
          {field.text}
        </Link>
      );
    case 'insetText':
      return <InsetText field={field} apiData={apiData} />;
      case 'govuk-caption':
      case 'html-caption':
        return <Caption field={field} apiData={apiData}/>
    default:
      return null;
  }
}

export default FieldFactory;

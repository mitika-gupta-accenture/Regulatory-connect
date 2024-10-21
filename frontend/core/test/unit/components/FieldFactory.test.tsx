import React from "react";
import { render, screen } from "@testing-library/react";
import FieldFactory, { FieldType } from "../../../components/FieldFactory";
import { ErrorSummaryType } from '../../../components/ErrorSummary';
import { CaptionFieldType } from "../../../components/Caption";  

const mockTextInput: FieldType = {
  type: "text",
  identifier: "text input 1",
  label: "Enter your first name",
  errorMessage: "Please enter your first name",  
  size: 20,  
  prefix: false,  
  prefixValue: "",  
  suffix: false,  
  suffixValue: "",  
  id: "input-id",  
};

const mockParagraphField: FieldType = {
  type: "paragraph",
  identifier: "paragraph 1",
  content: ["First paragraph content"],
};

const mockGovukCaption: CaptionFieldType = {
  type: "govuk-caption",
  identifier: "caption1",
  text: "This is a GOV.UK caption",  
};

const mockHtmlCaption: CaptionFieldType = {
  type: "html-caption",
  identifier: "caption2",
  text: "This is an HTML caption",  
};

const errorSummary = {
  title: "Error summary",
  errors: [],
};

describe("FieldFactory component", () => {
  it('renders TextInput component for "text" field type', () => {
    render(<FieldFactory field={mockTextInput} errorSummary={errorSummary} apiData={{
      USER_SESSION: {
        content: 'Content is from API',
      }
    }} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it('renders Paragraph component for "paragraph" field type', () => {
    render(<FieldFactory field={mockParagraphField} errorSummary={errorSummary} apiData={{
      USER_SESSION: {
        content: 'Content is from API',
      }
    }} />);
    expect(screen.getByText(/First paragraph content/i)).toBeInTheDocument();
  });

  it('renders GOV.UK Caption component for "govuk-caption" field type', () => {
    render(<FieldFactory field={mockGovukCaption} errorSummary={errorSummary} apiData={{
      USER_SESSION: {
        content: 'Content is from API',
      }
    }} />);
    expect(screen.getByText(/This is a GOV.UK caption/i)).toBeInTheDocument();
  });

  it('renders HTML Caption component for "html-caption" field type', () => {
    render(<FieldFactory field={mockHtmlCaption} errorSummary={errorSummary} apiData={{
      USER_SESSION: {
        content: 'Content is from API',
      }
    }} />);
    expect(screen.getByText(/This is an HTML caption/i)).toBeInTheDocument();
  });
});

describe('FieldFactory Component', () => {
  let errorSummary: ErrorSummaryType;

  beforeEach(() => {
    errorSummary = { title: "Example Error Summary", errors: [] };
  });

  it('returns null for unsupported field type', () => {
    const field: FieldType = {
      type: "invalidtype" as any,
      identifier: "example",
      content: "Invalid content" as any
    };
    const { container } = render(<FieldFactory field={field} errorSummary={errorSummary} apiData={{
      USER_SESSION: {
        content: 'Content is from API',
      }
    }} />);
    expect(container.firstChild).toBeNull();
  });
});
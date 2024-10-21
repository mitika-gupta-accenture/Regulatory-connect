'use client';

import FindErrorMessage from '../util/Errors';
import { ErrorSummaryType } from './ErrorSummary';
import { Conditional } from './Conditional';
import React, { useEffect, useState } from 'react';
import { UploadFile } from 'core/models/file';

export interface SingleFileInputFieldType {
  type: 'file';
  identifier: string;
  'question-identifier'?: string;
  label?: string;
  exampleAnswer: string;
  errorMessage?: string;
  name?: string;
  size: number;
  maxFileUploads: number;
  addMoreButtonText?: string;
  addMoreButtonType?: string;
  apiDataKey?: string;
  showChangeLinkInSummary?: boolean;
}

export type FileUploadProps = {
  field: SingleFileInputFieldType;
  files: UploadFile[];
  errorSummary: ErrorSummaryType;
  previousAnswer?: string;
};

function FileUpload({ field, files, errorSummary }: FileUploadProps) {
  const [fileSelected, setFileSelected] = useState(false);
  const [jsEnabled, setJsEnabled] = useState(false);

  const [identifier, setIdentifier] = useState(field.identifier);
  const [label, setLabel] = useState(field.label || 'Upload a file');
  const [name, setName] = useState(field.name || identifier);

  const [formGroupClass, setFormGroupClass] = useState('govuk-form-group');
  const [inputClass, setInputClass] = useState('govuk-file-upload');
  const [errorId, setErrorId] = useState(`${identifier}-error`);
  const [errorMessage, setErrorMessage] = useState(
    FindErrorMessage(errorSummary, field) || '',
  );

  const [hasErrors, setHasErrors] = useState(!!errorMessage);

  useEffect(() => {
    setJsEnabled(true);
    setFileSelected(false);

    if (hasErrors) {
      setFormGroupClass(
        formGroupClass => `${formGroupClass} govuk-form-group--error`,
      );
      setInputClass(inputClass => `${inputClass} govuk-file-upload--error`);
    }

    if (document.getElementById('file-upload')) {
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    }
  }, [jsEnabled, files]);

  return (
    <div className={formGroupClass} data-testid="file-upload-form-group">
      <Conditional showWhen={!!files?.length}>
        <br />
        <h2 className="govuk-heading-s">Files added</h2>
        <tbody className="govuk-table__body">
          {files.map(file => {
            return (
              <tr className="govuk-table__row" key={file.blobName}>
                <td className="govuk-table__cell">{file.fileName} </td>
                <td
                  className="govuk-table__cell"
                  style={{ paddingLeft: '1rem' }}
                >
                  <a
                    href={`/report/${field['question-identifier']}?delete-file=${file.blobName}`}
                    id={file.blobName}
                    className="govuk-link"
                  >
                    Remove
                  </a>
                </td>
                <br />
              </tr>
            );
          })}
        </tbody>
        <br />
      </Conditional>
      <Conditional showWhen={files?.length < field.maxFileUploads}>
        <label className="govuk-label" htmlFor="file-upload">
          {label}
        </label>
        <div id={`hint-${field.label}`} className="govuk-hint">
          {field.exampleAnswer + field.size + ' MB'}
        </div>
        <Conditional showWhen={hasErrors}>
          <p
            id={errorId}
            className="govuk-error-message"
            data-testid="file-upload-error-text"
          >
            <span className="govuk-visually-hidden">Error: </span>
            {errorMessage}
          </p>
        </Conditional>

        <input
          className={inputClass}
          id="file-upload"
          name={name}
          onChange={e => {
            setFileSelected(!!e.currentTarget.value);
          }}
          type="file"
          aria-describedby={hasErrors ? errorId : undefined}
        />
        {(!jsEnabled || fileSelected) && (
          <div>
            <input type="hidden" name="fileUpload" value={'true'} />
          </div>
        )}
      </Conditional>
    </div>
  );
}

export default FileUpload;

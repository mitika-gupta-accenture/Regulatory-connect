/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/await-thenable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../components/FileUpload';

describe('FileUpload', function () {
  const renderFileUpload = async (props: FileUploadProps) => {
    render(<FileUpload {...props} />);
  };

  it('renders with a label', async function () {
    await renderFileUpload({
      field: {
        identifier: 'some-file',
        name: 'someFile',
        label: 'Upload a file',
        type: 'file',
        exampleAnswer: '',
        size: 0,
        maxFileUploads: 1,
      },
      errorSummary: {
        errors: [],
        title: '',
      },
      files: [],
    });

    expect(screen.getByText('Upload a file')).toBeInTheDocument();
  });

  it('does not render error content when there is no error', async function () {
    await renderFileUpload({
      field: {
        identifier: 'some-file',
        name: 'someFile',
        label: 'Upload a file',
        type: 'file',
        exampleAnswer: '',
        size: 1,
        maxFileUploads: 1,
      },
      errorSummary: {
        errors: [],
        title: '',
      },
      files: [],
    });

    expect(screen.queryByTestId('file-upload-error-text')).toBeNull();
    expect(screen.getByTestId('file-upload-form-group')).not.toHaveClass(
      'govuk-form-group--error',
    );
    expect(
      screen.getByLabelText('Upload a file', { selector: 'input' }),
    ).not.toHaveClass('govuk-file-upload--error');
  });

  it('renders error content when there is an error', async function () {
    await renderFileUpload({
      field: {
        identifier: 'some-file',
        name: 'someFile',
        label: 'Upload a file',
        type: 'file',
        exampleAnswer: '',
        size: 0,
        maxFileUploads: 1,
      },
      errorSummary: {
        errors: [
          { message: 'File must be less than 2MB', linkId: 'some-file' },
        ],
        title: '',
      },
      files: [],
    });

    expect(screen.getByTestId('file-upload-error-text')).toHaveTextContent(
      'Error: File must be less than 2MB',
    );
    expect(screen.getByTestId('file-upload-form-group')).toHaveClass(
      'govuk-form-group--error',
    );
    expect(
      screen.getByLabelText('Upload a file', { selector: 'input' }),
    ).toHaveClass('govuk-file-upload--error');
  });
});

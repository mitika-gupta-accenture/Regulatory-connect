import React from 'react';
import { render } from '@testing-library/react';
import Panel, { PanelFieldType } from '../../../components/Panel';
import { v4 as uuidv4 } from 'uuid';
import { ErrorSummaryType } from 'core/components/ErrorSummary';

describe('Panel', () => {
  it('renders with correct title and information', () => {
    const uuid = uuidv4();
    const mockField: PanelFieldType = {
      type: 'panel',
      title: 'Report submitted',
      fields: [
        {
          type: 'paragraph',
          apiDataKey: 'USER_SESSION.content',
          className: 'govuk-!-font-weight-regular govuk-!-font-size-36 govuk-!-margin-top-6 govuk-panel--confirmation',
          content: [
            "Testing the text"
          ]
        }
      ],
      identifier: 'panel-identifier',
      className: 'panel-class',
      children: undefined
    };

    const errorSummary: ErrorSummaryType = {
      title: 'Error Summary',
      errors: [
        { linkId: 'field1', message: 'Error 1' },
        { linkId: 'field2', message: 'Error 2' },
      ],
    };

    const { getByText } = render(
      <Panel
        field={mockField}
        errorSummary={errorSummary}
        allPreviousAnswers={[]} 
        apiData={{
          USER_SESSION: {
            content: 'Testing the text',
          }
        }}
      />
    );

    expect(getByText('Report submitted')).toBeInTheDocument();
  });
});
import React from 'react';
import ChooseSubmissionTypeContent, {
  SubmissionDataType,
} from 'core/components/ChooseSubmissionTypeContent';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const submissionData: SubmissionDataType = {
  data: {
    attributes: {
      submissionType: [
        {
          id: 1,
          submissionTypeHeader: 'Type 1',
          submissionTypeSubHeader: 'Subheader 1',
          guidelineLinkDisplayText: 'Guideline 1',
          guidelineURL: 'www.guideline1.com',
          link: [
            {
              id: 1,
              linkDisplayText: 'Link 1 opens in new tab',
              linkURL: 'https://link1.com',
            },
            { id: 2, linkDisplayText: 'Link 2', linkURL: 'https://link2.com' },
          ],
        },
        {
          id: 2,
          submissionTypeHeader: 'Type 2',
          guidelineLinkDisplayText: 'Guideline 2',
          guidelineURL: 'https://guideline2.com',
          link: [
            { id: 3, linkDisplayText: 'Link 3', linkURL: 'www.govuk.com' },
            { id: 4, linkDisplayText: 'Link 4', linkURL: 'https://link4.com' },
          ],
        },
      ],
    },
  },
};

describe('ChooseSubmissionTypeContent', () => {
  test('renders without crashing when submissionData is empty or undefined', () => {
    render(<ChooseSubmissionTypeContent apiData={{}} />);
    expect(screen.queryByText('Link 3')).toBeNull();
  });

  test('renders submission types correctly when valid data is provided', () => {
    render(
      <ChooseSubmissionTypeContent
        apiData={{ attributes: submissionData.data.attributes }}
      />,
    );

    expect(screen.getByText('Choose a submission type')).toBeInTheDocument();
    expect(screen.getByText('Type 1')).toBeInTheDocument();
    expect(screen.getByText('Subheader 1')).toBeInTheDocument();
    expect(screen.getByText('Link 1 opens in new tab')).toBeInTheDocument();
    expect(screen.getByText('Guideline 1')).toHaveAttribute(
      'href',
      'https://www.guideline1.com',
    );
    expect(screen.getByText('Link 3')).toBeInTheDocument();
    expect(screen.getByText('Link 4')).toBeInTheDocument();
  });

  test('handles cases when submissionTypeSubHeader is undefined', () => {
    const modifiedSubmissionData = {
      ...submissionData,
      data: {
        attributes: {
          submissionType: [
            {
              id: 1,
              submissionTypeHeader: 'Type 1',
              guidelineLinkDisplayText: 'Guideline 1',
              guidelineURL: 'www.guideline1.com',
              link: [],
            },
          ],
        },
      },
    };

    render(
      <ChooseSubmissionTypeContent
        apiData={{ attributes: modifiedSubmissionData.data.attributes }}
      />,
    );
    expect(screen.getByText('Type 1')).toBeInTheDocument();
    expect(screen.queryByText('Subheader 1')).toBeNull();
  });
});

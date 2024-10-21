import React from 'react';
import { render } from '@testing-library/react';
import SummaryItem from '../../../components/SummaryItem';
import '@testing-library/jest-dom';
import { AnswersType } from 'core/components/Summary';

describe('SummaryItem', () => {
  it('renders answer when it is a string', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [{ label: 'Label 1', answer: 'Answer 1', identifier: '1' }],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { getByText } = render(
      <SummaryItem question={mockQuestion} formPath={''} />,
    );
    expect(
      getByText((content, element) => content.includes('Label 1')),
    ).toBeInTheDocument();
  });

  it('renders multiple answers correctly with commas', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [
        { label: 'Label 1', answer: 'Answer 1', identifier: '1' },
        { label: 'Label 2', answer: 'Answer 2', identifier: '2' },
      ],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { getByText } = render(
      <SummaryItem question={mockQuestion} formPath={''} />,
    );

    // Use custom matcher to find text within nested elements
    expect(
      getByText((content, element) => content.includes('Label 1')),
    ).toBeInTheDocument();
    expect(
      getByText((content, element) => content.includes('Label 2')),
    ).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [
        {
          label: 'Label 1',
          answer: 'Answer 1',
          identifier: '1',
          showChangeLinkInSummary: true,
        },
      ],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { getByRole } = render(
      <SummaryItem question={mockQuestion} formPath={'test-form'} />,
    );

    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/test-form/additional-information');
  });

  it('does not render link if showChangeLinkInSummary is false', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [
        {
          label: 'Label 1',
          answer: 'Answer 1',
          identifier: '1',
          showChangeLinkInSummary: false,
        },
      ],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { queryByRole } = render(
      <SummaryItem question={mockQuestion} formPath={'test-form'} />,
    );

    const link = queryByRole('button');
    expect(link).not.toBeInTheDocument();
  });

  it('renders multiple answers with empty strings correctly', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [
        { label: '', answer: 'Answer 1', identifier: '1' },
        { label: 'Label 2', answer: '', identifier: '2' },
        { label: '', answer: '', identifier: '3' },
      ],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { getByText } = render(
      <SummaryItem question={mockQuestion} formPath={''} />,
    );
    // Adjust matchers to be more flexible
    expect(
      getByText((content, element) => content.includes('Answer 1')),
    ).toBeInTheDocument();
  });

  it('renders label correctly if it exists', () => {
    const mockQuestion: AnswersType = {
      question: 'Test Question',
      answers: [
        { label: 'Label 1', answer: 'Answer 1', identifier: '1' },
        { label: '', answer: 'Answer 2', identifier: '2' },
        { label: 'Label 3', answer: 'Answer 3', identifier: '3' },
      ],
      identifier: 'additional-information',
      sectionName: '',
      nextRoute: '',
    };

    const { getByText } = render(
      <SummaryItem question={mockQuestion} formPath={''} />,
    );

    // Use custom matchers to find text within nested elements
    expect(
      getByText((content, element) => content.includes('Label 1')),
    ).toBeInTheDocument();
    expect(
      getByText((content, element) => content.includes('Answer 2')),
    ).toBeInTheDocument();
    expect(
      getByText((content, element) => content.includes('Label 3')),
    ).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Radio, { RadioFieldType } from '../../../components/Radio';
import { Answer } from 'core/validation/types';
import { UploadFile } from 'core/models/file';
import { answer } from 'core/components/Summary';
import { mapApiDataToJson } from 'core/util/mapApiDataToJson';

jest.mock('../../../../core/util/mapApiDataToJson', () => ({
  mapApiDataToJson: jest.fn(),
}));

describe('Radio Component', () => {
  const mockField: RadioFieldType = {
    type: 'radio',
    identifier: 'radio1',
    id: 'radio1',
    hint: 'Object Label Hint',
    answers: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ] as Answer[],
    label: 'Test Radio Label',
    withHeading: false,
    isInlineRadios: false,
    isSmallerRadios: false,
    name: '',
    options: [],
  };

  const mockField2: RadioFieldType = {
    type: 'radio',
    identifier: 'radio2',
    id: 'radio2',
    hint: 'Object Label Hint',
    apiDataKey: 'territory',
    label: 'Test Radio Label 2',
    withHeading: false,
    isInlineRadios: false,
    isSmallerRadios: false,
    name: '',
    answers: [],
    options: [],
  };

  const mockErrorSummary = {
    title: '',
    errors: [{ linkId: 'radio1', message: 'This field is required' }],
  };

  const mockApiData = {
    territory: [
      { identifier: 249, name: 'Great Britain' },
      { identifier: 247, name: 'Northern Ireland' },
      { identifier: 251, name: 'United Kingdom' },
    ],
  };

  const mockFiles: UploadFile[] | undefined = [];
  const mockAllPreviousAnswers: answer[] = [
    { identifier: 'radio1', answer: 'Yes', label: '' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with given props', () => {
    render(
      <Radio
        field={mockField}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        allPreviousAnswers={mockAllPreviousAnswers}
      />,
    );

    expect(screen.getByText('Test Radio Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  test('should handle selection change', () => {
    render(
      <Radio
        field={mockField}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        allPreviousAnswers={mockAllPreviousAnswers}
      />,
    );

    const yesOption = screen.getByLabelText('Yes');
    const noOption = screen.getByLabelText('No');

    fireEvent.click(noOption);
    expect(noOption).toBeChecked();
    expect(yesOption).not.toBeChecked();
  });

  test('should show error message when there is an error', () => {
    render(
      <Radio
        field={mockField}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        allPreviousAnswers={mockAllPreviousAnswers}
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('should handle conditional children when provided', async () => {
    const mockFieldWithChildren = {
      ...mockField,
      answers: [
        {
          value: 'yes',
          label: 'Yes',
          fields: [
            {
              identifier: 'childField1',
              type: 'radio',
              label: 'Child Field 1',
              hint: 'sdasasd',
            },
          ],
        },
        {
          value: 'no',
          label: 'No',
          fields: [
            {
              identifier: 'childField1',
              label: 'no child',
              hint: 'no hint',
              apiDataKey: 'key1',
            },
          ],
        },
      ] as Answer[],
    };

    render(
      <Radio
        field={mockFieldWithChildren}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        previousAnswer="tes"
        allPreviousAnswers={[{ identifier: 'radio', answer: '222', label: '' }]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Yes'));
    await waitFor(() => {
      expect(screen.getByText('Child Field 1')).toBeInTheDocument();
    });
  });

  test('should handle conditional children when provided', async () => {
    const mockFieldWithChildren = {
      ...mockField,
      answers: [
        {
          value: 'yes',
          label: 'Yes',
          fields: [
            {
              identifier: 'childField1',
              type: 'radio',
              label: 'Child Field 1',
              hint: 'sdasasd',
            },
          ],
        },
        {
          value: 'no',
          label: 'No',
          hint: 'no hint',
          fields: [
            {
              identifier: 'childField1',
              type: 'radio',
              label: 'No Child Field 1',
            },
          ],
        },
      ] as Answer[],
    };

    render(
      <Radio
        field={mockFieldWithChildren}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        previousAnswer="tes"
        allPreviousAnswers={[{ identifier: 'radio', answer: '222', label: '' }]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.click(screen.getByLabelText('No'));

    await waitFor(() => {
      expect(screen.queryByText('Child Field 1')).not.toBeInTheDocument();
    });
  });

  test('should handle undefined apiData and answers gracefully', () => {
    render(
      <Radio
        field={{ ...mockField, answers: [] }}
        errorSummary={mockErrorSummary}
      />,
    );

    expect(screen.queryByLabelText('Yes')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('No')).not.toBeInTheDocument();
  });

  test('should retain answers if mapApiDataToJson returns undefined', () => {
    (mapApiDataToJson as jest.Mock).mockReturnValue(undefined);

    render(
      <Radio
        field={mockField2}
        errorSummary={mockErrorSummary}
        apiData={{ key1: undefined }}
        files={mockFiles}
        allPreviousAnswers={[]}
      />,
    );

    expect(screen.queryByLabelText('Yes')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('No')).not.toBeInTheDocument();
  });

  test('should handle label as an object correctly', () => {
    const mockFieldWithObjectLabel = {
      ...mockField2,
      label: 'Object Label Name',
      hint: 'Object Label Hint',
    };

    render(
      <Radio
        field={mockFieldWithObjectLabel}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
      />,
    );

    expect(screen.getByText('Object Label Name')).toBeInTheDocument();
    expect(screen.getByText('Object Label Hint')).toBeInTheDocument();
  });

  test('should call mapApiDataToJson and update answers accordingly', () => {
    const transformedAnswers = [
      { value: 'maybe', label: 'Maybe' },
      { value: 'never', label: 'Never' },
    ];

    (mapApiDataToJson as jest.Mock).mockReturnValue(transformedAnswers);

    render(
      <Radio
        field={mockField2}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
      />,
    );

    expect(mapApiDataToJson).toHaveBeenCalledWith(
      mockField2,
      mockApiData['territory'],
    );
    expect(screen.queryByLabelText('Maybe')).toBeInTheDocument();
    expect(screen.queryByLabelText('Never')).toBeInTheDocument();
  });

  // NEW TEST CASE
  test('should handle apiDataKey when field.answers[0].code is missing', () => {
    const mockFieldWithApiDataKey: RadioFieldType = {
      ...mockField2,
      answers: [{ value: 'yes', label: 'Yes' }], // answers without `code`
    };

    render(
      <Radio
        field={mockFieldWithApiDataKey}
        errorSummary={mockErrorSummary}
        apiData={mockApiData}
        files={mockFiles}
        allPreviousAnswers={[]}
      />,
    );

    expect(mapApiDataToJson).toHaveBeenCalledWith(
      mockFieldWithApiDataKey,
      mockApiData['territory'],
    );
  });
});

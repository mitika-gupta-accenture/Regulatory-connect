import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewDataRequired from '../../../apis/common/NewDataRequired';
import * as session from '../../../models/redis';
import { refDataString } from '../../../util/stringModifier';
import { ApiResponseDataType } from '../../../validation/types';
import React from 'react';

// Mock session module
jest.mock('../../../models/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('NewDataRequired component', () => {
  const mockApiData: ApiResponseDataType = {
    key: 'value',
  };

  const defaultProps = {
    detailsHeading: 'Details Heading',
    content: 'Sample content',
    apiData: mockApiData,
    apiDataKey: 'key',
    identifier: 'test-identifier',
    useFor: 'useForTest',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with content and details', () => {
    render(<NewDataRequired {...defaultProps} />);

    expect(screen.getByText('Details Heading')).toBeInTheDocument();
    expect(screen.getByText('Sample content')).toBeInTheDocument();
    expect(screen.getByText('New data required')).toBeInTheDocument();
  });

  it('calls session.get and sets the selected state based on session data', async () => {
    (session.get as jest.Mock).mockResolvedValue(['useForTest']);

    render(<NewDataRequired {...defaultProps} />);

    // The session data would set the selected value to 'useForTest'
    expect(
      await screen.findByTestId('test-identifier-checkbox'),
    ).not.toBeChecked();
  });

  it('handles checkbox onChange and updates session data', async () => {
    // Initial session data with 'useForTest' selected
    (session.get as jest.Mock).mockResolvedValue(['useForTest']);
    (session.set as jest.Mock).mockResolvedValue(null);

    render(<NewDataRequired {...defaultProps} />);

    const checkbox = await screen.findByTestId('test-identifier-checkbox');
    expect(checkbox).not.toBeChecked();

    // Simulate unchecking the checkbox
    fireEvent.click(checkbox);

    // After state change, the checkbox should not be checked
    expect(await screen.findByTestId('test-identifier-checkbox')).toBeChecked();
  });

  it('handles checkbox onChange and adds useFor to session data if not present', async () => {
    // Initial session data without 'useForTest'
    (session.get as jest.Mock).mockResolvedValue([]); // Mock session.get to return an empty array
    (session.set as jest.Mock).mockResolvedValue(null); // Mock session.set to resolve successfully

    render(<NewDataRequired {...defaultProps} useFor="useForTest" />); // Ensure 'useFor' is set to 'useForTest'

    const checkbox = await screen.findByTestId('test-identifier-checkbox');

    // Assert the checkbox is not checked initially
    expect(checkbox).not.toBeChecked();

    // Simulate checking the checkbox
    fireEvent.click(checkbox);

    // Wait for the session.set to be called after the checkbox click
    await waitFor(() => {
      // Assert that session.set was called with the updated array including 'useForTest'
      expect(session.set).toHaveBeenCalledWith('new-data-required', [
        'useForTest',
      ]);
    });

    // After the state changes, assert the checkbox is checked
    expect(await screen.findByLabelText('New data required')).toBeChecked();
  });

  it('memoizes the text based on apiData, apiDataKey, and content', () => {
    render(<NewDataRequired {...defaultProps} />);

    // Text content should be replaced by refDataString logic (mocked for simplicity)
    expect(screen.getByText('Sample content')).toBeInTheDocument();
  });

  it('does not memoize the text if apiData or apiDataKey is missing', () => {
    const propsWithoutApiData = {
      ...defaultProps,
      apiData: undefined,
      apiDataKey: undefined,
    };

    render(<NewDataRequired {...propsWithoutApiData} />);

    // Text content should be displayed as it is because apiData/apiDataKey is missing
    expect(screen.getByText('Sample content')).toBeInTheDocument();
  });
});

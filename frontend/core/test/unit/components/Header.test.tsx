import React from 'react';
import { render } from '@testing-library/react';
import Header from '../../../components/Header';

jest.mock('../../../components/SignInButton', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the GOV.UK logo', () => {
    const { getByText } = render(<Header />);
    const govUKTitle = getByText('GOV.UK');

    expect(govUKTitle).toBeInTheDocument();
  });
});

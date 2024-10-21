import React from 'react';
import { render, screen } from '@testing-library/react';
import { MainLayout } from 'core/components/MainLayout';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../../../../authConfig';

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn().mockReturnValue({
    instance: {},
    accounts: [],
  }),
  useIsAuthenticated: jest.fn().mockReturnValue(true),
  MsalProvider: (props: any) => <div>{props.children}</div>,
}));

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('../../../components/CookieBanner', () => () => <div data-testid="CookieBanner-render">CookieBanner</div>);
jest.mock('../../../components/SkipLink', () => () => <div data-testid="SkipLink-render">SkipLink</div>);
jest.mock('../../../components/Header', () => () => <div data-testid="Header-render">Header</div>);
jest.mock('../../../components/Footer', () => () => <div data-testid="Footer-render">Footer</div>);
jest.mock('../../../components/PhaseBanner', () => () => <div data-testid="PhaseBanner-render">PhaseBanner</div>);

describe('MainLayout', () => {
  const mockChildren = <div data-testid="mock-children">Mock Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the MsalProvider and initializes PublicClientApplication correctly', () => {
    render(
      <MsalProvider instance={new PublicClientApplication(msalConfig)}>
        <MainLayout>{mockChildren}</MainLayout>
      </MsalProvider>
    );

    expect(PublicClientApplication).toHaveBeenCalledWith(msalConfig);
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });

  it('renders all sub-components of the layout', () => {
    render(
      <MsalProvider instance={new PublicClientApplication(msalConfig)}>
        <MainLayout>{mockChildren}</MainLayout>
      </MsalProvider>
    );

    // Check if all sub-components are rendered
    expect(screen.getByTestId('CookieBanner-render')).toBeInTheDocument();
    expect(screen.getByTestId('SkipLink-render')).toBeInTheDocument();
    expect(screen.getByTestId('Header-render')).toBeInTheDocument();
    expect(screen.getByTestId('PhaseBanner-render')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByTestId('Footer-render')).toBeInTheDocument();
  });

  it('handles edge cases when no children are provided', () => {
    render(
      <MsalProvider instance={new PublicClientApplication(msalConfig)}>
        <MainLayout>{null}</MainLayout>
      </MsalProvider>
    );

    // Ensure layout renders even without children
    expect(screen.getByTestId('CookieBanner-render')).toBeInTheDocument();
    expect(screen.getByTestId('Header-render')).toBeInTheDocument();
    expect(screen.getByTestId('PhaseBanner-render')).toBeInTheDocument();
    expect(screen.getByTestId('Footer-render')).toBeInTheDocument();
  });

});
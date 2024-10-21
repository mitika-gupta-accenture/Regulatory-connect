import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Link, { LinkType } from '../../../components/Link';

describe('Link Component', () => {

    const mockLink: LinkType = {
        type: 'link',
        id: 'mock-link-id',
        href: '/mock-url',
        noVisitedState: true,
        isInverse: false,
        noUnderline: true,
        className: 'mock-link-class',
        opensInNewTab: true,
        prefetch: false,
        children: 'Mock Link Text',
    };

    it('renders link with correct attributes and text', () => {
        render(<Link {...mockLink} />);

        const linkElement = screen.getByText('Mock Link Text');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('id', 'mock-link-id');
        expect(linkElement).toHaveAttribute('href', '/mock-url');
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noreferrer noopener');
    });

    it('renders link without opensInNewTab attribute', () => {
        const { opensInNewTab, ...mockLinkWithoutNewTab } = mockLink;
        render(<Link {...mockLinkWithoutNewTab} />);

        const linkElement = screen.getByText('Mock Link Text');
        expect(linkElement).not.toHaveAttribute('target');
        expect(linkElement).not.toHaveAttribute('rel');
    });

    it('renders link with prefetch behavior', () => {
        render(<Link {...mockLink} prefetch={true} />);

        const linkElement = screen.getByText('Mock Link Text');

        expect(linkElement).toHaveAttribute('href', '/mock-url');
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noreferrer noopener');

        expect(linkElement).toHaveClass('govuk-link');

    });

    it('renders link with inverse class when isInverse is true', () => {
        const mockLinkInverse: LinkType = {
            ...mockLink,
            isInverse: true,
        };
        render(<Link {...mockLinkInverse} />);

        const linkElement = screen.getByText('Mock Link Text');

        expect(linkElement).toHaveClass('govuk-link');
        expect(linkElement).toHaveClass('govuk-link--inverse');
    });

    it('renders link without optional classes when props are false', () => {
        const mockLinkWithoutClasses: LinkType = {
            ...mockLink,
            noVisitedState: false,
            noUnderline: false,
            className: '',
        };
        render(<Link {...mockLinkWithoutClasses} />);

        const linkElement = screen.getByText('Mock Link Text');
        expect(linkElement).toHaveClass('govuk-link');
        expect(linkElement).not.toHaveClass('govuk-link--no-visited-state');
        expect(linkElement).not.toHaveClass('govuk-link--no-underline');
        expect(linkElement).not.toHaveClass('mock-link-class');
    });

});
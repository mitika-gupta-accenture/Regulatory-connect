import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsetText, { InsetFieldType } from '../../../components/InsetText';

describe('InsetText', () => {
    const mockField: InsetFieldType = {
        "type": "insetText",
        "apiDataKey": "USER_SESSION.content",
        "text": "Hi Content is from API Text",
        "identifier": ''
    };
    const apiData = {
        USER_SESSION: {
            content: 'Hi Content is from API Text',
        }
    };

    it('renders with text attribute', () => {

        const { container } = render(<InsetText field={mockField} apiData={apiData} />);
        const paragraphs = container.querySelector('.govuk-inset-text');
        expect(paragraphs).toHaveTextContent("Hi Content is from API Text");
    });
    it('renders with text with dynamic api values attribute', () => {

        const { container } = render(<InsetText field={{ ...mockField, apiDataKey: "" }} apiData={apiData} />);
        const paragraphs = container.querySelector('.govuk-inset-text');
        expect(paragraphs).toHaveTextContent("Hi Content is from API Text");
    });
});
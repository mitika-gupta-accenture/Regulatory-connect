import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParagraphComponent, { ParagraphFieldType } from 'core/components/Paragraph';

describe('ParagraphComponent', () => {
    const mockField: ParagraphFieldType = {
        type: 'paragraph',
        identifier: 'test-paragraph',
        content: ['First line', 'Second line'],
        className: 'custom-class',
        size: 'm',
        id: ''
    };

    it('renders nothing if content array is empty', () => {
        const emptyContentField: ParagraphFieldType = {
            type: 'paragraph',
            identifier: 'empty-content-paragraph',
            content: [],
            className: '',
            size: 'l',
            id: ''
        };

        const { container } = render(<ParagraphComponent field={emptyContentField} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders paragraphs with specified className', () => {
        const customClassField: ParagraphFieldType = {
            type: 'paragraph',
            identifier: 'custom-class-paragraph',
            content: ['First line', 'Second line'],
            className: 'custom-paragraph',
            size: 'l',
            id: ''
        };

        const { container } = render(<ParagraphComponent field={customClassField} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        const paragraphs = container.querySelectorAll('.custom-paragraph');

        expect(paragraphs.length).toBe(customClassField.content.length);
        paragraphs.forEach((paragraph) => {
            expect(paragraph).toBeInTheDocument();
        });
    });

    it('uses correct ids when id is present', () => {
        const fieldWithId: ParagraphFieldType = {
            type: 'paragraph',
            identifier: 'id-paragraph',
            content: ['First line', 'Second line'],
            className: 'custom-class',
            size: 'm',
            id: 'custom-id'
        };

        const { container } = render(<ParagraphComponent field={fieldWithId} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        const paragraphs = container.querySelectorAll('.custom-class');

        paragraphs.forEach((paragraph, index) => {
            expect(paragraph).toHaveAttribute('id', `custom-id`);
        });
    });

    it('uses correct ids when id is not present', () => {
        const fieldWithoutId: ParagraphFieldType = {
            type: 'paragraph',
            identifier: 'test-paragraph',
            content: ['First line', 'Second line'],
            className: 'custom-class',
            size: 'm',
            id: ''
        };

        const { container } = render(<ParagraphComponent field={fieldWithoutId} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        const paragraphs = container.querySelectorAll('.custom-class');

        paragraphs.forEach((paragraph, index) => {
            expect(paragraph).toHaveAttribute('id', `test-paragraph-${index}`);
        });
    });

    it('renders paragraphs with correct text content', () => {
        const { container } = render(<ParagraphComponent field={{
            ...mockField, apiDataKey: "USER_SESSION.content", content: [
                "Hello hi"
            ]
        }} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        const paragraphs = container.querySelectorAll('.custom-class');

        expect(paragraphs[0]).toHaveTextContent("Hello hi");

    });


    it('renders nothing if content is not an array', () => {
        const invalidContentField: ParagraphFieldType = {
            type: 'paragraph',
            identifier: 'invalid-content-paragraph',
            content: [],
            className: '',
            size: 'l',
            id: ''
        };

        const { container } = render(<ParagraphComponent field={invalidContentField} apiData={{
            USER_SESSION: {
                content: 'Content is from API',
            }
        }} />);
        const paragraphs = container.querySelectorAll('.custom-class');

        paragraphs.forEach((paragraph, index) => {

            expect(paragraph).toBeNull();
        });
    });
});
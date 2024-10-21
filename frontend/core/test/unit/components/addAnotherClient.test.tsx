import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAnotherClient from 'core/apis/add-another/addAnotherClient';
import InputWithDelete from 'core/apis/add-another/InputWithDelete';
jest.mock('../../../../core/components/FieldFactory', () => jest.fn(() => <div>FieldFactory Mock</div>));
jest.mock('../../../../core/apis/add-another/InputWithDelete', () => jest.fn(() => <div>InputWithDelete Mock</div>));

const mockField: any = {
    identifier: 'plni-number-input',
    type: 'text',
    addMoreButtonText: 'Add another authorisation number',
    addMoreButtonType: 'secondary',
    validations: [
        {
            required: 'Enter an authorisation number',
        },
    ],
    label: 'Enter authorisation number',
    errorMessage: 'please enter an authorisation number',
    size: 20,
    value: '',
    prefix: "",
    suffix: '',
    prefixValue: '',
    suffixValue: '',
    id: ''
}

const mockAnswers: any = [

    {
        identifier: 'plni-number-input',
        type: 'text',
        addMoreButtonText: 'Add another authorisation number',
        addMoreButtonType: 'secondary',
        validations: [
            {
                required: 'Enter an authorisation number',
            },
        ],
        label: 'Enter authorisation number',
        errorMessage: 'please enter an authorisation number',
        size: 20,
        value: '',
        prefix: "",
        suffix: '',
        prefixValue: '',
        suffixValue: '',
        id: ''
    }
];

// Mock dependencies
jest.mock('../../../../core/apis/add-another/actions', () => ({
    addAnotherBehavior: jest.fn(),
}));

describe('AddAnotherClient', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle no answers and render nothing in the row', () => {
        render(<AddAnotherClient field={mockField} answers={[]} />);

        // No answers, so no components should be rendered in the first row
        expect(screen.queryByText('FieldFactory Mock')).not.toBeInTheDocument();
        expect(screen.queryByText('InputWithDelete Mock')).not.toBeInTheDocument();
    });

    it('should use default button text when field.addMoreButtonText is not provided', () => {
        const fieldWithoutButtonText = {
            ...mockField,
            addMoreButtonText: undefined,
        };

        render(<AddAnotherClient field={fieldWithoutButtonText} answers={mockAnswers} />);

        const button = screen.getByRole('button', { name: 'Add another' });
        expect(button).toBeInTheDocument();
    });



    it('should render InputWithDelete for subsequent answers (i > 0)', () => {
        const mockMultipleAnswers = [
            ...mockAnswers,
            { identifier: 'plni-number-input-2', value: 'Second answer' }
        ];

        render(<AddAnotherClient field={mockField} answers={mockMultipleAnswers} />);

        // Ensure the second answer is rendered by InputWithDelete
        expect(InputWithDelete).toHaveBeenCalledWith(
            expect.objectContaining({
                field: mockMultipleAnswers[1],
                firstFieldID: 'plni-number-input',
            }),
            expect.anything()
        );
        expect(screen.getByText('InputWithDelete Mock')).toBeInTheDocument();
    });
    it('should not apply "govuk-button--secondary" class when field.addMoreButtonType is not "secondary"', () => {
        const fieldWithoutSecondaryButtonType = {
            ...mockField,
            addMoreButtonType: 'primary',  // or any other value
        };

        render(<AddAnotherClient field={fieldWithoutSecondaryButtonType} answers={mockAnswers} />);

        const button = screen.getByRole('button', { name: 'Add another authorisation number' });
        expect(button).not.toHaveClass('govuk-button--secondary');
    });

});

import React from 'react';
import '@testing-library/jest-dom';
import AddAnother, { getCurrentState } from '../../../apis/add-another/AddAnother';
import * as session from '../../../../core/models/redis';
import { revalidatePath } from 'next/cache';
// Mock external dependencies
jest.mock('../../../../core/models/redis', () => ({
    getFormState: jest.fn(),
    setFormState: jest.fn(),
}));

jest.mock('../../../apis/add-another/addAnotherClient', () => jest.fn(() => <div>AddAnotherClient Mock</div>));

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

const mockField: any = {
    identifier: 'field1',
    type: 'text',
    rule: 'some-rule',
    fields: [
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
        },
    ],
};

const mockAnswers: any = [
    {
        identifier: 'plni-number-input',
        answer: '12345',
        label: 'Dummy label',
    },
];

describe('AddAnother', () => {
    it('should call revalidatePath with "/" when getCurrentState is executed', async () => {
        (session.getFormState as jest.Mock).mockResolvedValue([]);

        await getCurrentState(mockField, mockAnswers);

        expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should call setFormState with the field if getFormState returns null', async () => {
        // Arrange
        (session.getFormState as jest.Mock).mockResolvedValue(null);

        // Act
        await getCurrentState(mockField, mockAnswers);

        // Assert
        expect(session.setFormState).toHaveBeenCalledWith(mockField.identifier!, [mockField]);
    });

    it('should correctly update formstate when previousAnswers is provided', async () => {
        const formstate: any = [
            { identifier: 'plni-number-input' },
            { identifier: 'other-field' },
        ];

        (session.getFormState as jest.Mock).mockResolvedValue(formstate);

        const updatedFormstate = await getCurrentState(mockField, mockAnswers);

        expect(updatedFormstate).toEqual([
            { identifier: 'plni-number-input', value: '12345' },
            { identifier: 'other-field' },
        ]);
    });

    it('should handle empty formstate array from session', async () => {
        (session.getFormState as jest.Mock).mockResolvedValue([]);

        const formstate = await getCurrentState(mockField, mockAnswers);

        expect(formstate).toEqual([]);
    });

    it('should handle scenarios where previousAnswers does not match any formstate identifiers', async () => {
        const formstate: any = [
            { identifier: 'plni-number-input' },
            { identifier: 'another-field' },
        ];

        (session.getFormState as jest.Mock).mockResolvedValue(formstate);

        const updatedFormstate = await getCurrentState(mockField, [
            {
                identifier: 'non-matching-id',
                answer: '98765',
                label: 'Another label',
            },
        ]);

        expect(updatedFormstate).toEqual([
            { identifier: 'plni-number-input' },
            { identifier: 'another-field' },
        ]);
    });

});



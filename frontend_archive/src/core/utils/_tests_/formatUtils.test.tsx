import { getFormattedDateTime } from '../formatUtils';

describe('renderUtils', () => {
    it('returns formated date', () => {
        let date = getFormattedDateTime();
        expect(date).toContain('GMT on');
    })
})
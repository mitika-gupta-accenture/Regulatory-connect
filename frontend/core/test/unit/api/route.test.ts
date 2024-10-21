import { GET } from '../../../../app/api/generate-csv/route';
import * as session from '../../../models/redis';

jest.mock('../../../../core/models/redis', () => ({
    get: jest.fn(),
}));

(global as any).Response = class {
    body: string;
    status: number;
    headers: Map<string, string>;

    constructor(body: BodyInit | null, init: ResponseInit) {
        this.body = body ? body.toString() : '';
        this.status = init.status || 200;
        this.headers = new Map(Object.entries(init.headers || {}));
    }

    async text() {
        return this.body;
    }

    async json() {
        return JSON.parse(this.body);
    }

    static error() {
        return new Response(null, { status: 500 });
    }

    static redirect(url: string | URL, status: number) {
        return new Response(null, { status, headers: { Location: url.toString() } });
    }
};

describe('GET function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a CSV response when data is an array of strings', async () => {
        (session.get as jest.Mock)
            .mockResolvedValueOnce(['row1', 'row2', 'row3'])
            .mockResolvedValueOnce('testPrefix');

        const response = await GET();
        const responseBody = await response.text();

        expect(responseBody).toBe('row1\nrow2\nrow3');
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/csv');
        expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="testPrefix.csv"');
        expect(session.get).toHaveBeenCalledTimes(2);
        expect(session.get).toHaveBeenCalledWith('MhraRIId');
        expect(session.get).toHaveBeenCalledWith('filePrefix');
    });

    it('should return 500 when data is not an array', async () => {
        (session.get as jest.Mock)
            .mockResolvedValueOnce('invalidData')
            .mockResolvedValueOnce('testPrefix');

        const response = await GET();
        const responseBody = await response.json();

        expect(responseBody.error).toBe('An error occurred');
        expect(response.status).toBe(500); // Expect 500 since an error occurs
        expect(response.headers.get('Content-Type')).toBe('application/json');
        expect(session.get).toHaveBeenCalledTimes(2);
        expect(session.get).toHaveBeenCalledWith('MhraRIId');
        expect(session.get).toHaveBeenCalledWith('filePrefix');
    });

    it('should return an empty CSV when data is an empty array', async () => {
        (session.get as jest.Mock)
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce('emptyPrefix');

        const response = await GET();
        const responseBody = await response.text();

        expect(responseBody).toBe(''); // Empty CSV
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/csv');
        expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="emptyPrefix.csv"');
        expect(session.get).toHaveBeenCalledTimes(2);
        expect(session.get).toHaveBeenCalledWith('MhraRIId');
        expect(session.get).toHaveBeenCalledWith('filePrefix');
    });



    it('should handle prefix being null or undefined', async () => {
        (session.get as jest.Mock)
            .mockResolvedValueOnce(['row1', 'row2']) // Mock valid data
            .mockResolvedValueOnce(null); // Mock null prefix

        const response = await GET();
        const responseBody = await response.text();

        expect(responseBody).toBe('row1\nrow2');
        expect(response.status).toBe(200); // Still expect 200
        expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="null.csv"');
        expect(session.get).toHaveBeenCalledTimes(2);
        expect(session.get).toHaveBeenCalledWith('MhraRIId');
        expect(session.get).toHaveBeenCalledWith('filePrefix');
    });
});

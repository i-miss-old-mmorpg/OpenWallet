import { getTransactionHistory } from './api.js';

describe('getTransactionHistory', () => {
    let mockFetch;

    beforeEach(() => {
        mockFetch = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    const testCases = [
        {
            status: 200, ok: true, responseBody: {
                status: '1',
                message: 'OK',
                result: [
                    {
                        timeStamp: '1699824432',
                        hash: '111',
                        from: 'abc',
                        to: 'def',
                        value: '1'
                    },
                    {
                        timeStamp: '1699824433',
                        hash: '222',
                        from: 'abc',
                        to: 'def',
                        value: '2'
                    }
                ]
            }, expected: (result) => {
                expect(result['111']).toEqual({
                    from: "abc",
                    to: "def",
                    value: "1",
                    timeStamp: "1699824432"
                });
            }
        },
        {
            status: 500, ok: false, responseBody: {
                status: '1',
                message: 'OK',
                result: [
                    {
                        timeStamp: '1699824432',
                        hash: '111',
                        from: 'abc',
                        to: 'def',
                        value: '1'
                    },
                    {
                        timeStamp: '1699824433',
                        hash: '222',
                        from: 'abc',
                        to: 'def',
                        value: '2'
                    }
                ]
            }, expected: (result) => {
                // TBD
                expect(result['111']).toEqual({
                    from: "abc",
                    to: "def",
                    value: "1",
                    timeStamp: "1699824432"
                });
            }
        }
    ];

    test.each(testCases)('returns the expected result with a response of status %s', async ({ status, ok, responseBody, expected }) => {
        mockFetch.mockResolvedValueOnce({
            ok,
            status,
            json: () => Promise.resolve(responseBody),
        });

        const address = '0x00';
        const result = await getTransactionHistory(address);

        // Check the result
        expected(result);
    });
});
import { AxiosError } from 'axios';
import { ApiError, withApiErrorHandling } from '@/api/error-handler';

function axiosErrorWithResponse(status, data) {
    return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', {}, {}, { status, data });
}

describe('ApiError', () => {
    it('carries message, status and data', () => {
        const error = new ApiError('boom', 404, { reason: 'missing' });

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('ApiError');
        expect(error.message).toBe('boom');
        expect(error.status).toBe(404);
        expect(error.data).toEqual({ reason: 'missing' });
    });
});

describe('withApiErrorHandling', () => {
    it('passes arguments through and returns the result', async () => {
        const fn = vi.fn().mockResolvedValue('result');

        const result = await withApiErrorHandling(fn)('a', 1);

        expect(result).toBe('result');
        expect(fn).toHaveBeenCalledWith('a', 1);
    });

    it('wraps an axios error with a response in an ApiError', async () => {
        const fn = vi.fn().mockRejectedValue(axiosErrorWithResponse(500, { error: 'server' }));

        const promise = withApiErrorHandling(fn)();

        await expect(promise).rejects.toBeInstanceOf(ApiError);
        await expect(promise).rejects.toMatchObject({
            message: 'Request failed',
            status: 500,
            data: { error: 'server' },
        });
    });

    it('wraps an axios error without a response with null status and data', async () => {
        const fn = vi.fn().mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'));

        await expect(withApiErrorHandling(fn)()).rejects.toMatchObject({
            name: 'ApiError',
            message: 'Network Error',
            status: null,
            data: null,
        });
    });

    it('wraps any other error in a generic ApiError', async () => {
        const fn = vi.fn().mockRejectedValue(new TypeError('bad'));

        await expect(withApiErrorHandling(fn)()).rejects.toMatchObject({
            name: 'ApiError',
            message: 'Unexpected error occurred',
        });
    });
});

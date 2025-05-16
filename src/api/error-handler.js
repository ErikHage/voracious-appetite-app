import axios from "axios";

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export function withApiErrorHandling(fn) {
    return async function (...args) {
        try {
            return await fn(...args);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new ApiError(
                    error.message,
                    error.response ? error.response.status : null,
                    error.response ? error.response.data : null
                );
            } else {
                throw new ApiError("Unexpected error occurred");
            }
        }
    };
}
import { ApiResponse } from '@/types/api';

/**
 * Used with Zod to extract client errors from a validation result.
 *
 * ClientErrors = {
 *   [key: string]: string[];
 * }
 *
 * @param errors - The validation errors object from Zod.
 * @param defaultClientErrors - An optional default object to merge with the errors.
 * @returns A new object containing the client errors, merging with any defaults.
 */
export function getClientErrors(
    errors: Record<string, string[]>,
    defaultClientErrors: Record<string, string[]> = {}
) {
    return Object.keys(errors).reduce(
        (acc, key) => ({
            ...acc,
            [key]: errors[key] || [],
        }),
        defaultClientErrors
    );
}

/**
 * Checks the response error from next-auth and returns a user-friendly error message.
 *
 * @param error - The error string from next-auth.
 * @returns A user-friendly error message based on the error type.
 */
export function getErrorMessage(error: string) {
    switch (error) {
        case 'CredentialsSignin':
            return 'Invalid email or password';
        case 'UserNotFound':
            return 'User not found';
        default:
            return 'An unexpected error occurred';
    }
}

export const toCents = (value: number) => Math.round(value * 100);
export const fromCents = (value: number) => value / 100;

export async function fetchWrapper<T>(
    url: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const json = await res.json().catch(() => undefined);

    if (!res.ok) {
        return { success: false, error: json?.error ?? 'An error occurred' };
    }

    return { success: true, data: json.data as T };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

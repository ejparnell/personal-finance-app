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

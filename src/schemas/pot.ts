import { z } from 'zod';
import { themeOptions } from '@/types/theme';

export const potSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Pot name must be at least 1 character long' })
        .max(30, { message: 'Pot name must be at most 30 characters long' }),
    target: z
        .number()
        .min(0, { message: 'Target amount must be at least 0' })
        .max(1_000_000, { message: 'Target amount must be at most 1,000,000' }), 
    total: z
        .number()
        .min(0, { message: 'Total amount must be at least 0' })
        .max(1_000_000, { message: 'Total amount must be at most 1,000,000' }),
    theme: z.enum(
        themeOptions.map(option => option.className) as [string, ...string[]],
        {
            required_error: 'Theme is required',
            invalid_type_error: 'Theme must be a valid option',
        }
    ),
});

export type PotInput = z.infer<typeof potSchema>;

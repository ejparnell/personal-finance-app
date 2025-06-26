import { z } from 'zod';

const overviewNumberSchema = z
    .number()
    .min(0, { message: 'Current balance must be at least 0' })
    .max(1_000_000, { message: 'Current balance must be at most 1,000,000' });

export const currentBalanceSchema = z.object({
    currentBalance: overviewNumberSchema,
});

export type CurrentBalanceType = z.infer<typeof currentBalanceSchema>;


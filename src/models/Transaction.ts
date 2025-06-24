import { Schema, model, models, InferSchemaType } from 'mongoose';
import { fromCents, toCents } from '@/lib/utils';

const TransactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true,
        },
        avatar: String,
        name: { type: String, trim: true, required: true },
        category: {
            type: String,
            enum: [
                'General',
                'Dining Out',
                'Groceries',
                'Entertainment',
                'Transportation',
                'Lifestyle',
                'Personal Care',
                'Bills',
                'Education',
                'Shopping',
            ],
            required: true,
        },
        date: { type: Date, required: true, index: true },
        amountCents: { type: Number, required: true },
        recurring: { type: Boolean, default: false },
    },
    { timestamps: true }
);

TransactionSchema.virtual('amount')
    .get(function () {
        return fromCents(this.amountCents);
    })
    .set(function (v: number) {
        this.amountCents = toCents(v);
    });

export type TransactionDoc = InferSchemaType<typeof TransactionSchema>;
export const Transaction =
    models.Transaction<TransactionDoc> ||
    model<TransactionDoc>('Transaction', TransactionSchema);

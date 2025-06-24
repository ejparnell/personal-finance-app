import { InferSchemaType, Schema, model, models } from 'mongoose';

const BalanceSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
        currentBalance: { type: Number, required: true, default: 0 },
        income: { type: Number, required: true, default: 0 },
        expenses: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export type BalanceDoc = InferSchemaType<typeof BalanceSchema>;
export const Balance = models.Balance<BalanceDoc> || model<BalanceDoc>('Balance', BalanceSchema);

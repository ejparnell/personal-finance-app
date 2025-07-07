import {
    Schema,
    model,
    models,
    InferSchemaType,
    HydratedDocument,
} from 'mongoose';

const PotSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        target: { type: Number, required: true },
        total: { type: Number, default: 0 },
        theme: String,
    },
    { timestamps: true }
);

PotSchema.index({ user: 1, name: 1 }, { unique: true });

export type PotType = InferSchemaType<typeof PotSchema>;
export type PotDoc = HydratedDocument<PotType>;
export const Pot = models.Pot<PotDoc> || model<PotDoc>('Pot', PotSchema);

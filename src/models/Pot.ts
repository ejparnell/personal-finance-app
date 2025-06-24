import { Schema, model, models, InferSchemaType } from 'mongoose'
import { fromCents, toCents } from '@/lib/utils'

const PotSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetCents: { type: Number, required: true },
    totalCents: { type: Number, default: 0 },
    theme: String
  },
  { timestamps: true }
)

PotSchema.index({ user: 1, name: 1 }, { unique: true })

PotSchema.virtual('target')
  .get(function () { return fromCents(this.targetCents) })
  .set(function (v: number) { this.targetCents = toCents(v) })

PotSchema.virtual('total')
  .get(function () { return fromCents(this.totalCents) })
  .set(function (v: number) { this.totalCents = toCents(v) })

export type PotDoc = InferSchemaType<typeof PotSchema>
export const Pot =
  models.Pot<PotDoc> || model<PotDoc>('Pot', PotSchema)

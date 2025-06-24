import { Schema, model, models, InferSchemaType } from 'mongoose'
import { fromCents, toCents } from '@/lib/utils'

const BudgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    maximumCents: { type: Number, required: true },
    theme: String
  },
  { timestamps: true }
)

BudgetSchema.index({ user: 1, category: 1 }, { unique: true })

BudgetSchema.virtual('maximum')
  .get(function () { return fromCents(this.maximumCents) })
  .set(function (v: number) { this.maximumCents = toCents(v) })

export type BudgetDoc = InferSchemaType<typeof BudgetSchema>
export const Budget =
  models.Budget<BudgetDoc> || model<BudgetDoc>('Budget', BudgetSchema)

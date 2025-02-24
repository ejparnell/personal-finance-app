import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    current: {
      type: Number,
      required: true,
      default: 0
    },
    income: {
      type: Number,
      required: true,
      default: 0
    },
    expenses: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Account || mongoose.model('Account', AccountSchema)

import mongoose from 'mongoose'

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    },
    maximum: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true
})

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)
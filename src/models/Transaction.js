import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)
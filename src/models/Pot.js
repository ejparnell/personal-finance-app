import mongoose from 'mongoose'

const PotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    theme: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.models.Pot || mongoose.model('Pot', PotSchema)
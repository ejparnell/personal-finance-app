import User from '@/models/User'
import Transaction from '@/models/Transaction'

export async function getTransactionsByUser(userEmail) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const transactions = await Transaction.find({ user: currentUser._id })
        return transactions
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createTransaction(userEmail, transaction) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const newTransaction = await Transaction.create({ ...transaction, user: currentUser._id })
        return newTransaction
    } catch (error) {
        console.error(error)
        return null
    }
}
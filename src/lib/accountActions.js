import Account from '@/models/Account'
import User from '@/models/User'

export async function getAccountByUser(userEmail) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const account = await Account.findOne({ user: currentUser._id })
        return account
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createAccount(userEmail, { current, income, expenses }) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const account = await Account.create({
            user: currentUser._id,
            current,
            income,
            expenses
        })
        return account
    } catch (error) {
        console.error(error)
        return null
    }
}
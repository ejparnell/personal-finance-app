import User from '@/models/User'
import Budget from '@/models/Budget'

export async function getBudgetsByUser(userEmail) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const budgets = await Budget.find({ user: currentUser._id })
        return budgets
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createBudget(userEmail, budget) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const newBudget = await Budget.create({ ...budget, user: currentUser._id })
        return newBudget
    } catch (error) {
        console.error(error)
        return null
    }
}
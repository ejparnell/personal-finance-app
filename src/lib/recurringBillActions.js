import User from '@/models/User'
import RecurringBill from '@/models/RecurringBill'

export async function getRecurringBillsByUser(userEmail) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const recurringBills = await RecurringBill.find({ user: currentUser._id })
        return recurringBills
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createRecurringBill(userEmail, data) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const recurringBill = new RecurringBill({ ...data, user: currentUser._id })
        await recurringBill.save()
        const recurringBills = await RecurringBill.find({ user: currentUser._id })
        return recurringBills
    } catch (error) {
        console.error(error)
        return null
    }
}
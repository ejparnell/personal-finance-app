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
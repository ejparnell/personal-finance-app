// TODO: Move these functions to a utils file
// Calculate total pot saved
export function calculateTotalPotSaved(potArr) {
    if (!potArr || potArr.length === 0) return 0
    return potArr.reduce((total, pot) => total + pot.total, 0)
}

// Calculate total budget spent
export function calculateTotalBudgetSpent(transactionsArr) {
    if (!transactionsArr || transactionsArr.length === 0) return 0
    return transactionsArr.reduce((total, transaction) => total + transaction.amount, 0)
}

// Calculate total budget
export function calculateTotalBudget(budgetArr) {
    if (!budgetArr || budgetArr.length === 0) return 0
    return budgetArr.reduce((total, budget) => total + budget.maximum, 0)
}

// Calculate paid bills
export function calculatePaidBills(recurringBillsArr) {
    if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
    const calculated = recurringBillsArr.reduce((total, bill) => {
        if (new Date(bill.date) < new Date()) {
            total += bill.amount
        }
        return total
    }, 0)

    return Math.abs(calculated)
}

// Calculate total upcoming
export function calculateTotalUpcoming(recurringBillsArr) {
    if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
    const calculated = recurringBillsArr.reduce((total, bill) => {
        if (new Date(bill.date) > new Date()) {
            total += bill.amount
        }
        return total
    }, 0)

    return Math.abs(calculated)
}

// Calculate due soon
export function calculateDueSoon(recurringBillsArr) {
    if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
    const dueSoonDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const calculated = recurringBillsArr.reduce((total, bill) => {
        if (new Date(bill.date) < dueSoonDate) {
            total += bill.amount
        }
        return total
    }, 0)
    return Math.abs(calculated)
}
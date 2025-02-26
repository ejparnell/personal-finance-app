import { useState } from 'react'

import { deleteBudget } from '../budgetServices'
import Modal from '@/components/Modal'

export default function BudgetConfirmDelete({ 
    setIsBudgetDeleteOpen, 
    setBudgets,
    session,
    budget,
    onUpdateSuccess,
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    function handleCloseModal() {
        setIsBudgetDeleteOpen(false)
        setError(null)
        onUpdateSuccess()
    }

    // Handle budget deletion
    async function handleBudgetDelete(budgetId) {
        setIsSubmitting(true)
        setError(null)
        try {
            const data = await deleteBudget(session, budgetId)
            setBudgets(data.budgets)
            onUpdateSuccess()
            setIsBudgetDeleteOpen(false)
        } catch (error) {
            console.error(error)
            setError(error.message || 'An error occurred while deleting the budget.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal onClose={() => handleCloseModal()}>
            <div>
                <h2>Delete {budget.name}? </h2>
                <p>
                    Are you sure you want to delete this budget? This action
                    cannot be reversed, and all the data inside it will be removed
                    forever.
                </p>
                <button onClick={() => handleBudgetDelete(budget._id)}>Yes, Confrim Deletion</button>
                <button onClick={() => setIsBudgetDeleteOpen(false)}>No, Go Back</button>
            </div>
        </Modal>
    )
}
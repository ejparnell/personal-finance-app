import { useState } from 'react'

import { deleteRecurringBill } from '../recurringBillServices'
import Modal from '@/components/Modal'

export default function RecurringBillConfirmDelete({
    setIsRecurringBillDeleteOpen,
    recurringBill,
    setAllRecurringBills,
    handleRecurringBillsUpdate,
    session,
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    function handleCloseModal() {
        setIsRecurringBillDeleteOpen(false)
        setError(null)
    }

    async function handleDeleteRecurringBill() {
        setIsLoading(true)
        setError(null)

        try {
            const data = await deleteRecurringBill(session, recurringBill._id)
            setAllRecurringBills(data.recurringBills)
            handleRecurringBillsUpdate(data.recurringBills)
            handleCloseModal()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Modal onClose={handleCloseModal}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this recurring bill?</p>
                <div>
                    <button onClick={handleCloseModal}>Cancel</button>
                    <button onClick={handleDeleteRecurringBill}>Delete</button>
                </div>
                {isLoading && <p>Loading...</p>}
                {error && <p>{error}</p>}
            </Modal>
        </div>
    )
}
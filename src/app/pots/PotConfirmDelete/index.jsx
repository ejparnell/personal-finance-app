import { useState } from 'react'

import { deletePot } from '../potServices'
import Modal from '@/components/Modal'

export default function PotConfirmDelete({
    setIsPotDeleteOpen,
    setPots,
    session,
    pot,
    onDeleteSuccess,
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Handle deleting a pot
    async function handlePotDelete(potId) {
        setIsSubmitting(true)
        setError(null)
        try {
            const data = await deletePot(session, potId)
            setPots(data.pots)
            onDeleteSuccess()
            setIsPotDeleteOpen(false)
        } catch (error) {
            console.error(error)
            setError(error.message || 'An error occurred while deleting the pot.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal onClose={() => setIsPotDeleteOpen(false)}>
            <div>
                <h2>Delete {pot.name}? </h2>
                <p>
                    Are you sure you want to delete this pot? This action
                    cannot be reversed, and all the data inside it will be removed
                    forever.
                </p>
                <button onClick={() => handlePotDelete(pot._id)}>Yes, Confrim Deletion</button>
                <button onClick={() => setIsPotDeleteOpen(false)}>No, Go Back</button>
            </div>
        </Modal>
    )
}
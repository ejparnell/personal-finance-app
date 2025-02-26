import { useState } from 'react'

import { updatePot } from '../potServices'
import Modal from '@/components/Modal'

export default function PotWithdrawMoney({
    setIsPotWithdrawOpen,
    setPots,
    session,
    pot,
}) {
    const [formData, setFormData] = useState({
        total: 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Handle withdrawing money from a pot
    async function handleWithdrawMoney(potId) {
        formData.total = Number(pot.total) - Number(formData.total)
        setIsSubmitting(true)
        setError(null)
        try {
            const data = await updatePot(session, potId, formData)
            setPots(data.pots)
            setIsPotWithdrawOpen(false)
            setFormData({ total: 0 })
        } catch (error) {
            console.error(error)
            setError(error.message || 'An error occurred while withdrawing money from the pot.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calculate the percentage of the pot target
    function calculatePercentage() {
        const total = Number(pot.total) - Number(formData.total)
        return (Number(total) / Number(pot.target)) * 100
    }

    return (
        <Modal onClose={() => setIsPotWithdrawOpen(false)}>
            <div>
                <h2>Withdraw Money from {pot.name}</h2>
                <p>
                    How much money would you like to withdraw from this pot?
                </p>
                <p>New Amount ${Number(pot.total) - Number(formData.total)}</p>
                <p>{calculatePercentage()}% Target of ${pot.target}</p>
                <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={(e) => setFormData({ total: e.target.value })}
                />
                <button onClick={() => handleWithdrawMoney(pot._id)}>Confirm Withdrawal</button>
            </div>
        </Modal>
    )
}
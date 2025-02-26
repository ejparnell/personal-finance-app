import { useState } from 'react'

import { updatePot } from '../potServices'
import Modal from '@/components/Modal'

export default function PotAddMoney({
    setIsPotAddMoneyOpen,
    setPots,
    session,
    pot,
}) {
    const [formData, setFormData] = useState({
        total: 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    async function handleAddMoney(potId) {
        formData.total = Number(formData.total) + Number(pot.total)
        setIsSubmitting(true)
        setError(null)
        try {
            const data = await updatePot(session, potId, formData)
            setPots(data.pots)
            setIsPotAddMoneyOpen(false)
            setFormData({ total: 0 })
        } catch (error) {
            console.error(error)
            setError(error.message || 'An error occurred while adding money to the pot.')
        } finally {
            setIsSubmitting(false)
        }
    }

    function calculatePercentage() {
        const total = Number(pot.total) + Number(formData.total)
        return (Number(total) / Number(pot.target)) * 100
    }

    return (
        <Modal onClose={() => setIsPotAddMoneyOpen(false)}>
            <div>
                <h2>Add Money to {pot.name}</h2>
                <p>
                    How much money would you like to add to this pot?
                </p>
                <p>New Amount ${Number(pot.total) + Number(formData.total)}</p>
                <p>{calculatePercentage()}% Target of ${pot.target}</p>
                <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={(e) => setFormData({ total: e.target.value })}
                />
                <button onClick={() => handleAddMoney(pot._id)}>Confirm Addition</button>
            </div>
        </Modal>
    )
}
import { useState } from 'react'

import { defaultCategories } from '@/app/defaultData'
import { createRecurringBill } from '../recurringBillServices'
import Modal from '@/components/Modal'
import styles from './RecurringBillCreate.module.css'

export default function RecurringBillCreate({
    setIsRecurringBillCreateOpen,
    setAllRecurringBills,
    setFilteredRecurringBills,
    session,
    handleRecurringBillsUpdate,
}) {
    const [formData, setFormData] = useState({
        avatar: '',
        name: '',
        category: '',
        date: '',
        amount: 0,
        recurring: true,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    function handleCloseModal() {
        setIsRecurringBillCreateOpen(false)
        setFormData({ avatar: '', name: '', category: '', date: '', amount: 0, recurring: true })
        setError(null)
    }

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const data = await createRecurringBill(session, formData)
            setAllRecurringBills(data.recurringBills)
            setFilteredRecurringBills(data.recurringBills)
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
                <h2>Add New Recurring Bill</h2>
                <p>Enter the details of your recurring bill.</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {defaultCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Add Recurring Bill'}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </Modal>
        </div>
    )
}
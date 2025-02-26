import { useState } from 'react'

import { updateRecurringBill } from '../recurringBillServices'
import { defaultCategories } from '@/app/defaultData'
import Modal from '@/components/Modal'
import styles from './RecurringBillUpdate.module.css'

export default function RecurringBillUpdate({
    recurringBill,
    setIsRecurringBillEditOpen,
    setAllRecurringBills,
    handleRecurringBillsUpdate,
    session,
}) {
    const [formData, setFormData] = useState({
        _id: recurringBill._id,
        name: recurringBill.name || '',
        category: recurringBill.category || '',
        amount: recurringBill.amount || 0,
        recurring: recurringBill.recurring || true,
        date: recurringBill.date || '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Handle input changes
    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle modal close
    function handleCloseModal() {
        setIsRecurringBillEditOpen(false)
        setError(null)
    }

    // Handle form submission for updating a recurring bill
    async function handleSubmit(event) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        const recurringBillId = formData._id
        try {
            const data = await updateRecurringBill(session, recurringBillId, formData)
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
        <Modal onClose={handleCloseModal}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Edit Recurring Bill</h2>
                <label className={styles.label} htmlFor="name">
                    Name
                    <input
                        className={styles.input}
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className={styles.label} htmlFor="category">
                    Category
                    <select
                        className={styles.input}
                        name="category"
                        id="category"
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
                </label>
                <label className={styles.label} htmlFor="amount">
                    Amount
                    <input
                        className={styles.input}
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className={styles.label} htmlFor="date">
                    Date
                    <input
                        className={styles.input}
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button className={styles.button} type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Update Recurring Bill'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </Modal>
    )
}
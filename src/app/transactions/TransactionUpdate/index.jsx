'use client'

import { useState } from 'react'
import { updateTransaction } from '../transactionServices'
import Modal from '@/components/Modal'
import styles from './TransactionUpdate.module.css'

export default function TransactionUpdate({
    transaction,
    setIsTransactionUpdateOpen,
    setAllTransactions,
    setFilteredTransactions,
    session,
    categories,
}) {
    const [formData, setFormData] = useState({
        _id: transaction._id,
        avatar: transaction.avatar || '',
        name: transaction.name || '',
        category: transaction.category || '',
        date: transaction.date || '',
        amount: transaction.amount || 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        setIsTransactionUpdateOpen(false)
        setError(null)
    }

    // Handle form submission for updating a transaction
    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)
        const transactionId = formData._id
        try {
            const data = await updateTransaction(session, transactionId, formData)
            setAllTransactions(data.transactions)
            setFilteredTransactions(data.transactions)
            handleCloseModal()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <Modal onClose={handleCloseModal}>
                <h2>Update Transaction</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Transaction'}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </Modal>
        </div>
    )
}

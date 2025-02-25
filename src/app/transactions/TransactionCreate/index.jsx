'use client'

import { useState } from 'react'
import { createTransaction } from '../transactionServices'
import Modal from '@/components/Modal'
import styles from './TransactionCreate.module.css'

export default function TransactionCreate({
    setIsTransactionCreateOpen,
    setAllTransactions,
    setFilteredTransactions,
    session,
    categories,
}) {
    const [formData, setFormData] = useState({
        avatar: '',
        name: '',
        category: '',
        date: '',
        amount: 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Handle form input changes
    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle modal close
    function handleCloseModal() {
        setIsTransactionCreateOpen(false)
        setFormData({ avatar: '', name: '', category: '', date: '', amount: 0 })
        setError(null)
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const data = await createTransaction(session, formData)
            const newTransaction = data.transaction
            setAllTransactions((prev) => [...prev, newTransaction])
            setFilteredTransactions((prev) => [...prev, newTransaction])
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
                <h2>Add New Transaction</h2>
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
                        {isSubmitting ? 'Adding...' : 'Add Transaction'}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </Modal>
        </div>
    )
}

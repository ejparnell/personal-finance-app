'use client'

import { useState } from 'react'

import { updateBudget } from '../budgetServices'
import { defaultCategories, defaultItemThemes } from '@/app/defaultData'
import Modal from '@/components/Modal'
import styles from './BudgetUpdate.module.css'

export default function BudgetUpdate({
    budget,
    setIsBudgetEditOpen,
    setBudgets,
    session,
    onUpdateSuccess,
}) {
    const [formData, setFormData] = useState({
        _id: budget._id,
        category: budget.category || '',
        maximum: budget.maximum || 0,
        theme: budget.theme || '',
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
        setIsBudgetEditOpen(false)
        setError(null)
        onUpdateSuccess()
    }

    // Handle form submission for updating a budget
    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)
        const budgetId = formData._id
        try {
            const data = await updateBudget(session, budgetId, formData)
            setBudgets(data.budgets)
            onUpdateSuccess()
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

                <h2>Update Budget</h2>
                <p>As your budgets change, feel free to update your spending limits.</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
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
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="maximum">Maximum</label>
                        <input
                            type="number"
                            id="maximum"
                            name="maximum"
                            value={formData.maximum}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="theme">Theme</label>
                        <select
                            id="theme"
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a theme</option>
                            {defaultItemThemes.map((theme) => (
                                <option key={theme.name} value={theme.name}>
                                    {theme.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </Modal>
        </div>
    )
}
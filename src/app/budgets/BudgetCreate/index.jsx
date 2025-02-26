import { useState } from 'react'

import { defaultCategories, defaultItemThemes } from '@/app/defaultData'
import { createBudget } from '../budgetServices'
import Modal from '@/components/Modal'
import styles from './BudgetCreate.module.css'

export default function BudgetCreate({
    setIsBudgetCreateOpen,
    setBudgets,
    session,
}) {
    const [formData, setFormData] = useState({
        category: '',
        maximum: 0,
        theme: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Handle modal close
    function handleCloseModal() {
        setIsBudgetCreateOpen(false)
        setFormData({ category: '', maximum: 0, theme: '' })
        setError(null)
    }

    // Handle form input changes
    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const data = await createBudget(session, formData)
            setBudgets(data.budgets)
            handleCloseModal()
        } catch (error) {
            setError(error.message || 'An error occurred while adding a budget.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Modal onClose={handleCloseModal}>

                <h2>Add New Budget</h2>
                <p>Choose a category to set a spending budget. These categories can help you monitor spending.</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="category">Budget Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        {defaultCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="maximum">Maximum Spend</label>
                    <input
                        type="number"
                        id="maximum"
                        name="maximum"
                        value={formData.maximum}
                        onChange={handleChange}
                        placeholder="e.g. 2000"
                        required
                    />

                    <label htmlFor="theme">Theme</label>
                    <select
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a theme</option>
                        {defaultItemThemes.map((theme, index) => (
                            <option key={index} value={theme.name}>
                                {theme.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding Budget...' : 'Add Budget'}
                    </button>
                </form>
            </Modal>
        </div>
    )
}

'use client'
import { useState } from 'react'

import Modal from '@/components/Modal'
import { itemThemes } from '@/app/themes'
import styles from './BudgetCreate.module.css'

export default function BudgetCreate({ session, usedThemes, categories, setBudgets, onClose }) {
    const [formData, setFormData] = useState({
        category: '',
        maximum: '',
        theme: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    function handleCloseModal() {
        onClose(false)
        setFormData({ category: '', maximum: '', theme: '' })
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
            if (session) {
                const response = await fetch('/api/budgets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
    
                if (!response.ok) {
                    throw new Error('Failed to create budget')
                }
    
                setBudgets((prev) => [...prev, formData])
            } else {
                const localBudgets = JSON.parse(localStorage.getItem('defaultBudgets'))
                localBudgets.push(formData)
                localStorage.setItem('defaultBudgets', JSON.stringify(localBudgets))
                setBudgets(localBudgets)
            }
            
            handleCloseModal()
        } catch (err) {
            setError(err.message)
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
                        {categories.map((category, index) => (
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
                        {itemThemes.map((theme, index) => (
                            <option key={index} value={theme.name} disabled={usedThemes().includes(theme.color)}>
                                {theme.name}
                                {usedThemes().includes(theme.color) ? ' (Already Used)' : ''}
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

import { useState } from 'react'

import { defaultItemThemes } from '@/app/defaultData'
import { createPot } from '../potServices'
import Modal from '@/components/Modal'
import styles from './PotCreate.module.css'

export default function PotCreate({
    setIsPotCreateOpen,
    setPots,
    session,
}) {
    const [formData, setFormData] = useState({
        name: '',
        target: 0,
        theme: '',
        total: 0,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // handle modal close
    function handleCloseModal() {
        setIsPotCreateOpen(false)
        setFormData({ name: '', target: 0, theme: '' })
        setError(null)
    }

    // handle form input changes
    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // handle form submission
    async function handleSubmit(event) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const data = await createPot(session, formData)
            setPots(data.pots)
            handleCloseModal()
        } catch (error) {
            setError(error.message || 'An error occurred while adding a pot.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal onClose={handleCloseModal}>

            <h2>Add New Pot</h2>
            <p>Choose a category to set a spending pot. These categories can help you monitor spending.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="target">Target</label>
                    <input
                        type="number"
                        id="target"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
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

                <div className={styles.buttonGroup}>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Pot'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
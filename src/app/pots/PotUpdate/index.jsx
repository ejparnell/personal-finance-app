import { useState } from 'react'

import { updatePot } from '../potServices'
import { defaultItemThemes } from '@/app/defaultData'
import Modal from '@/components/Modal'
import styles from './PotUpdate.module.css'

export default function PotUpdate({
    pot,
    setIsPotEditOpen,
    setPots,
    session,
    onUpdateSuccess,
}) {
    const [formData, setFormData] = useState({
        _id: pot._id,
        name: pot.name || '',
        target: pot.target || 0,
        theme: pot.theme || '',
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

    function handleCloseModal() {
        setIsPotEditOpen(false)
        setError(null)
        onUpdateSuccess()
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)
        const potId = formData._id
        try {
            const data = await updatePot(session, potId, formData)
            setPots(data.pots)
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

                <h2>Edit Pot</h2>
                <p>If your saving targets change, feel free to update your pots.</p>

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
                            {defaultItemThemes.map((theme) => (
                                <option key={theme.name} value={theme.name}>
                                    {theme.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                    {error && <p>{error}</p>}
                </form>
            </Modal>
        </div>
    )
}
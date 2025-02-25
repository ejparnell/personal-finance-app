// EOD notes:
/*
I'm working on the setTransactions that is in my ApplicationDataContext.js file
Right now it is calling thw api and adding the transaction correctly to the database
I assume it's also updating the local storage correctly but I have not checked

Right now in the TransactionPage I would like for the newly created transaciton
to show up on a successful transaction creation. Right now it's not. I have to 
refresh the page. I think what I have to do is a lifted state situation where
I use the changing of props to trigger the re-render of the page. I would have 
to break out the pageniation items into their own component. I'm not sure that would
work or if I'm just moving shit and facing the same issue. I could also do a useEffect.
I wonder if I can set up a blank useEffect and pass the transactions as the dependency array.
This seems like it would not work though. 
*/

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import Modal from '@/components/Modal'
import styles from './TransactionCreate.module.css'

export default function TransactionCreate({ setIsTransactionCreateOpen, setTransactions }) {
    const { data: session } = useSession()
    const [formData, setFormData] = useState({
        avatar: '',
        name: '',
        category: '',
        date: '',
        amount: 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleCloseModal() {
        setIsTransactionCreateOpen(false)
        setFormData({ avatar: '', name: '', category: '', date: '', amount: 0 })
        setError(null)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            if (session) {
                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    throw new Error('Failed to create transaction')
                }
                const data = await response.json()
                setTransactions(data.transaction)
            } else {
                setTransactions(formData)
            }
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
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} />

                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />

                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} />

                    <button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Transaction'}
                    </button>
                </form>
            </Modal>
        </div>
    )
}
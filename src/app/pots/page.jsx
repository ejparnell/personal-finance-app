'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { fetchPots } from './potServices'
import PotCreate from './PotCreate'

export default function PotsPage() {
    const { data: session, status } = useSession()
    const [pots, setPots] = useState([])
    const [selectValues, setSelectValues] = useState({})
    const [isPotCreateOpen, setIsPotCreateOpen] = useState(false)
    const [isPotEditOpen, setIsPotEditOpen] = useState(false)
    const [isPotDeleteOpen, setIsPotDeleteOpen] = useState(false)
    const [potToEdit, setPotToEdit] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch pots initially
    useEffect(() => {
        async function getPots() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchPots(session)
                setPots(data.pots)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error occurred while fetching user data')
            } finally {
                setIsLoading(false)
            }
        }

        getPots()
    }, [])

    // Handles opening the edit or delete modal with the correct pot
    function handleEditDeleteOpen(event, pot) {
        const value = event.target.value
        if (!value) return
        setSelectValues((prev) => ({ ...prev, [pot._id]: value }))
        if (value === 'edit') {
            setPotToEdit(pot)
            setIsPotEditOpen(true)
        } else if (value === 'delete') {
            setPotToEdit(pot)
            setIsPotDeleteOpen(true)
        }
    }

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h1>Pots</h1>
            <button onClick={() => setIsPotCreateOpen(true)}>+ Add New Pot</button>

            {/* Create pot modal */}
            {isPotCreateOpen && (
                <PotCreate
                    setIsPotCreateOpen={setIsPotCreateOpen}
                    setPots={setPots}
                    session={session}
                />
            )}

            {/* Pots list */}
            <section>
                {pots.map((pot) => (
                    <div key={pot._id}>
                        <p>{pot.name}</p>

                        <select
                            value={selectValues[pot._id] || ''}
                            onChange={(e) => handleEditDeleteOpen(e, pot)}
                        >
                            <option value="">Select an action</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>

                        <p>Total Saved ${pot.total}</p>
                        <p>Target of ${pot.target}</p>

                        <button>+ Add Money</button>
                        <button>Withdraw</button>
                    </div>
                ))}
            </section>
        </>
    )
}
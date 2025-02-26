'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { fetchPots } from './potServices'
import PotCreate from './PotCreate'
import PotUpdate from './PotUpdate'
import PotConfirmDelete from './PotConfirmDelete'
import PotAddMoney from './PotAddMoney'
import PotWithdrawMoney from './PotWithdrawMoney'

export default function PotsPage() {
    const { data: session, status } = useSession()
    const [pots, setPots] = useState([])
    const [selectValues, setSelectValues] = useState({})
    const [isPotCreateOpen, setIsPotCreateOpen] = useState(false)
    const [isPotEditOpen, setIsPotEditOpen] = useState(false)
    const [isPotDeleteOpen, setIsPotDeleteOpen] = useState(false)
    const [potToEdit, setPotToEdit] = useState(null)
    const [isPotAddMoneyOpen, setIsPotAddMoneyOpen] = useState(false)
    const [isPotWithdrawOpen, setIsPotWithdrawOpen] = useState(false)
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

    function handleOpenAddMoney(pot) {
        setPotToEdit(pot)
        setIsPotAddMoneyOpen(true)
    }

    function handleOpenWithdraw(pot) {
        setPotToEdit(pot)
        setIsPotWithdrawOpen(true)
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

            {/* Edit pot modal */}
            {isPotEditOpen && potToEdit && (
                <PotUpdate
                    pot={potToEdit}
                    setIsPotEditOpen={setIsPotEditOpen}
                    setPots={setPots}
                    session={session}
                    onUpdateSuccess={() => {
                        setSelectValues((prev) => ({ ...prev, [potToEdit._id]: '' }))
                        setPotToEdit(null)
                    }}
                />
            )}

            {/* Delete pot modal */}
            {isPotDeleteOpen && potToEdit && (
                <PotConfirmDelete
                    pot={potToEdit}
                    setIsPotDeleteOpen={setIsPotDeleteOpen}
                    setPots={setPots}
                    session={session}
                    onDeleteSuccess={() => {
                        setSelectValues((prev) => ({ ...prev, [potToEdit._id]: '' }))
                        setPotToEdit(null)
                    }}
                />
            )}

            {/* Add money modal */}
            {isPotAddMoneyOpen && (
                <PotAddMoney
                    setIsPotAddMoneyOpen={setIsPotAddMoneyOpen}
                    setPots={setPots}
                    session={session}
                    pot={potToEdit}
                />
            )}

            {/* Withdraw money modal */}
            {isPotWithdrawOpen && (
                <PotWithdrawMoney
                    setIsPotWithdrawOpen={setIsPotWithdrawOpen}
                    setPots={setPots}
                    session={session}
                    pot={potToEdit}
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

                        <button onClick={() => handleOpenAddMoney(pot)}>+ Add Money</button>
                        <button onClick={() => handleOpenWithdraw(pot)}>Withdraw</button>
                    </div>
                ))}
            </section>
        </>
    )
}
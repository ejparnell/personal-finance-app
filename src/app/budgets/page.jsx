'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

import { fetchBudgetsAndTransaction } from './budgetServices'
import BudgetCreate from './BudgetCreate'
import BudgetUpdate from './BudgetUpdate'
import BudgetConfirmDelete from './BudgetConfirmDelete'

export default function BudgetsPage() {
    const { data: session, status } = useSession()
    const [budgets, setBudgets] = useState([])
    const [transactions, setTransactions] = useState([])
    const [isBudgetCreateOpen, setIsBudgetCreateOpen] = useState(false)
    const [isBudgetEditOpen, setIsBudgetEditOpen] = useState(false)
    const [selectValues, setSelectValues] = useState({})
    const [isBudgetDeleteOpen, setIsBudgetDeleteOpen] = useState(false)
    const [budgetToEdit, setBudgetToEdit] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Fetch budgets and transactions initially
    useEffect(() => {
        if (status === 'loading') return

        async function getBudgetsAndTransaction() {
            setLoading(true)
            setError('')
            try {
                const data = await fetchBudgetsAndTransaction(session)
                setBudgets(data.budgets)
                setTransactions(data.transactions)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error occurred while fetching user data')
            } finally {
                setLoading(false)
            }
        }

        getBudgetsAndTransaction()
    }, [session, status])

    // Calculate total budget spent
    function calculateTotalBudgetSpent(transactionsArr) {
        if (!transactionsArr || transactionsArr.length === 0) return 0
        return transactionsArr.reduce((total, transaction) => total + transaction.amount, 0)
    }

    // Calculate total budget
    function calculateTotalBudget(budgetArr) {
        if (!budgetArr || budgetArr.length === 0) return 0
        return budgetArr.reduce((total, budget) => total + budget.maximum, 0)
    }

    // Calculate spent budgets from transactions
    function calculateSpentBudgets(transactionsArr, category) {
        if (!transactionsArr || transactionsArr.length === 0) return 0
        const filteredTransactions = transactionsArr.filter(
            (transaction) => transaction.category.toLowerCase() === category.toLowerCase()
        )
        return Math.abs(filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0))
    }

    // Get latest 3 transactions for a category
    function getLatestTransactions(transactionsArr, category) {
        if (!transactionsArr || transactionsArr.length === 0) return []
        return transactionsArr
            .filter((transaction) => transaction.category.toLowerCase() === category.toLowerCase())
            .slice(0, 3)
    }

    // Handles opening the edit or delete modal with the correct budget
    function handleEditDeleteOpen(event, budget) {
        const value = event.target.value
        if (!value) return
        setSelectValues((prev) => ({ ...prev, [budget._id]: value }))
        if (value === 'edit') {
            setBudgetToEdit(budget)
            setIsBudgetEditOpen(true)
        } else if (value === 'delete') {
            setBudgetToEdit(budget)
            setIsBudgetDeleteOpen(true)
        }
    }

    if (status === 'loading' || loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h1>Budgets</h1>
            <button onClick={() => setIsBudgetCreateOpen(true)}>
                + Add New Budget
            </button>

            {/* Budget Create Modal */}
            {isBudgetCreateOpen && (
                <BudgetCreate
                    setIsBudgetCreateOpen={setIsBudgetCreateOpen}
                    setBudgets={setBudgets}
                    session={session}
                />
            )}

            {/* Overall Spending Overview */}
            <section>
                <div>
                    <p>${calculateTotalBudgetSpent(transactions)}</p>
                    <p>of ${calculateTotalBudget(budgets)} limit</p>
                </div>

                <div>
                    {budgets.map((budget) => (
                        <div key={budget._id}>
                            <p>{budget.category}</p>
                            <p>${calculateSpentBudgets(transactions, budget.category)} of {budget.maximum}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Individual Budget Breakdowns */}
            <section>
                {budgets.length > 0 ? (
                    budgets.map((budget) => (
                        <div key={budget._id}>
                            <p>{budget.category}</p>
                            <select
                                value={selectValues[budget._id] || ''}
                                onChange={(e) => handleEditDeleteOpen(e, budget)}
                            >
                                <option value="">Select an action</option>
                                <option value="edit">Edit</option>
                                <option value="delete">Delete</option>
                            </select>
                            <p>Maximum of ${budget.maximum}</p>
                            <p>Spent ${calculateSpentBudgets(transactions, budget.category)}</p>
                            <p>Remaining ${budget.maximum - calculateSpentBudgets(transactions, budget.category)}</p>

                            <div>
                                <p>Latest Spending</p>
                                <Link href="/transactions">See All</Link>
                                <div>
                                    {getLatestTransactions(transactions, budget.category).map((transaction) => (
                                        <div key={transaction._id}>
                                            {transaction.avatar && (
                                                <Image
                                                    src={`/${transaction.avatar}`}
                                                    alt={transaction.name}
                                                    width={50}
                                                    height={50}
                                                />
                                            )}
                                            <p>{transaction.name}</p>
                                            <p>{transaction.amount}</p>
                                            <p>{transaction.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No budgets</p>
                )}
            </section>

            {/* Budget Edit Modal */}
            {isBudgetEditOpen && budgetToEdit && (
                <BudgetUpdate
                    setIsBudgetEditOpen={setIsBudgetEditOpen}
                    setBudgets={setBudgets}
                    session={session}
                    budget={budgetToEdit}
                    onUpdateSuccess={() => {
                        setSelectValues((prev) => ({ ...prev, [budgetToEdit._id]: '' }))
                        setBudgetToEdit(null)
                    }}
                />
            )}

            {/* Budget Confirm Delete Modal */}
            {isBudgetDeleteOpen && budgetToEdit && (
                <BudgetConfirmDelete
                    setIsBudgetDeleteOpen={setIsBudgetDeleteOpen}
                    setBudgets={setBudgets}
                    session={session}
                    budget={budgetToEdit}
                    onUpdateSuccess={() => {
                        setSelectValues((prev) => ({ ...prev, [budgetToEdit._id]: '' }))
                        setBudgetToEdit(null)
                    }}
                />
            )}
        </>
    )
}

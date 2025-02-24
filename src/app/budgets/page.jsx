'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Cookies from 'js-cookie'

import BudgetCreate from './BudgetCreate'

export default function BudgetsPage() {
    const { data: session, status } = useSession()
    const [budgets, setBudgets] = useState([])
    const [transactions, setTransactions] = useState([])
    const [isBudgetCreateOpen, setIsBudgetCreateOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchBudgets() {
            try {
                setLoading(true)
                const res = await fetch('/api/budgets')
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || 'Error fetching budgets')
                }
                else {
                    setBudgets(data.budgets)
                }
            } catch (err) {
                setError('An error occurred while fetching budgets')
            } finally {
                setLoading(false)
            }
        }

        async function fetchTransactions() {
            try {
                setLoading(true)
                const res = await fetch('/api/transactions')
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || 'Error fetching transactions')
                }
                else {
                    const sortedTransactions = data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
                    setTransactions(sortedTransactions)
                }
            } catch (err) {
                setError('An error occurred while fetching transactions')
            } finally {
                setLoading(false)
            }
        }

        async function fetchDefaultData() {
            try {
                setLoading(true)
                let defaultData = Cookies.get('defaultData')
                if (!defaultData) {
                    const res = await fetch('/api/default-data')
                    defaultData = await res.json()
                    Cookies.set('defaultData', JSON.stringify(defaultData))
                }
                
                // setBudgets(defaultData.budgets)
                // setTransactions(defaultData.transactions)
            } catch (error) {
                console.log(error)
                setError('An error occurred while fetching default data')
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchBudgets()
            fetchTransactions()
        } else {
            fetchDefaultData()
        }
    }, [])

    useEffect(() => {
        if (transactions.length > 0) {
            // Creating a list of unique categories
            const categories = transactions.map(transaction => transaction.category)
            const uniqueCategories = [...new Set(categories)]
            setCategories(uniqueCategories)
        }
    }, [transactions])

    function calculateTotalBudgetSpent(transactionsArr) {
        if (transactionsArr.length === 0) return 0
        let totalSpent = 0
        transactionsArr.forEach(transaction => {
            totalSpent += transaction.amount
        })
        return totalSpent
    }

    function calculateTotalBudget(budgetArr) {
        if (budgetArr.length === 0) return 0
        let totalBudget = 0
        budgetArr.forEach(budget => {
            totalBudget += budget.maximum
        })
        return totalBudget
    }

    function calculateSpent(category) {
        if (transactions.length === 0) return 0
        let totalSpent = 0
        transactions.forEach(transaction => {
            if (transaction.category === category) {
                totalSpent += transaction.amount
            }
        })
        return Math.abs(totalSpent)
    }

    function handleOpenBudgetCreate() {
        setIsBudgetCreateOpen(true)
    }

    function handleCloseBudgetCreate() {
        setIsBudgetCreateOpen(false)
    }

    function usedThemes() {
        return budgets.map(budget => budget.theme)
    }

    return (
        <>
            <h1>Budgets</h1>
            <button onClick={handleOpenBudgetCreate}>+ Add New Button</button>
            {isBudgetCreateOpen && <BudgetCreate session={session} usedThemes={usedThemes} categories={categories} setBudgets={setBudgets} onClose={handleCloseBudgetCreate} />}

            {/* Summary budget card */}
            <div>
                <p>{calculateTotalBudgetSpent(transactions)}</p>
                <p>of {calculateTotalBudget(budgets)} limit</p>

                <div>
                    {budgets.length === 0 ? <p>No budgets</p> : budgets.map(budget => (<>
                        {/* Budget overview */}
                        <p>{budget.category}</p>
                        <p>Maximum of {budget.maximum}</p>

                        <p>
                            <span>Spent</span>
                            <span>{calculateSpent(budget.category)}</span>
                        </p>
                        <p>
                            <span>Remaining</span>
                            <span>{budget.maximum - calculateSpent(budget.category)}</span>
                        </p>

                        {/* Latest spending - top 3 transactions related to this budget category */}
                        <div>
                            <p>Latest Spending</p>
                            <Link href="/transactions">See All</Link>
                            {transactions.length === 0 ? (
                                <p>No transactions</p>
                            ) : (
                                transactions
                                    .filter(transaction => transaction.category === budget.category)
                                    .slice(0, 3)
                                    .map(transaction => (
                                        <div key={transaction.date}>
                                            <Image
                                                src={`/${transaction.avatar}`}
                                                alt={transaction.name}
                                                width={20}
                                                height={20}
                                            />
                                            <p>{transaction.name}</p>
                                            <p>{transaction.amount}</p>
                                            <p>{transaction.date}</p>
                                        </div>
                                    ))
                            )}
                        </div>
                    </>))}
                </div>
            </div>
        </>
    )
}
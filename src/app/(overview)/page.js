'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

import { fetchAllData } from './pageServices'

export default function Home() {
    const { data: session, status } = useSession()
    const [account, setAccount] = useState({})
    const [pots, setPots] = useState([])
    const [budgets, setBudgets] = useState([])
    const [transactions, setTransactions] = useState([])
    const [recurringBills, setRecurringBills] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch all data initially
    useEffect(() => {
        if (status === 'loading') return

        async function getAllData() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchAllData(session)
                console.log(data)
                setAccount(data.account)
                setPots(data.pots)
                setBudgets(data.budgets)
                setTransactions(data.transactions)
                setRecurringBills(data.recurringBills)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error occurred while fetching user data')
            } finally {
                setIsLoading(false)
            }
        }

        getAllData()
    }, [session, status])

    if (isLoading) {
        return <div>Loading...</div>
    }

    // Calculate total pot saved
    function calculateTotalPotSaved(potArr) {
        if (!potArr || potArr.length === 0) return 0
        return potArr.reduce((total, pot) => total + pot.total, 0)
    }

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

    // Calculate paid bills
    function calculatePaidBills(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) < new Date()) {
                total += bill.amount
            }
            return total
        }, 0)

        return Math.abs(calculated)
    }

    // Calculate total upcoming
    function calculateTotalUpcoming(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) > new Date()) {
                total += bill.amount
            }
            return total
        }, 0)

        return Math.abs(calculated)
    }

    // Calculate due soon
    function calculateDueSoon(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) < new Date() + 7) {
                total += bill.amount
            }
            return total
        }, 0)

        return Math.abs(calculated)
    }

    const topFiveTransactions =
        transactions && transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

    return (
        <>
            {/* Account Overview */}
            <h1>Overview</h1>
            <section>
                <div>
                    <p>Current Balance</p>
                    <p>{account?.current || 0}</p>
                </div>
                <div>
                    <p>Income</p>
                    <p>{account?.income || 0}</p>
                </div>
                <div>
                    <p>Expenses</p>
                    <p>{account?.expenses || 0}</p>
                </div>
            </section>

            {/* Pots Overview */}
            <section>
                <h2>Pots</h2>
                <Link href="/pots">See Details</Link>
                <div>
                    <p>Total Saved</p>
                    <p>{calculateTotalPotSaved(pots)}</p>
                </div>
                <div>
                    {pots.map((pot) => (
                        <div key={pot._id}>
                            <p>{pot.name}</p>
                            <p>{pot.total}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Transactions Overview */}
            <section>
                <h2>Transactions</h2>
                <Link href="/transactions">See Details</Link>
                <div>
                    {transactions.length === 0 ? (
                        <p>No transactions</p>
                    ) : (
                        topFiveTransactions.map((transaction) => (
                            <div key={transaction._id}>
                                {transaction.avatar && <Image
                                    src={`/${transaction.avatar}`}
                                    alt={transaction.name}
                                    width={50}
                                    height={50}
                                />}
                                <p>{transaction.name}</p>
                                <p>{transaction.amount}</p>
                                <p>{transaction.date}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Budgets Overview */}
            <section>
                <h2>Budgets</h2>
                <Link href="/budgets">See Details</Link>
                <p>
                    {calculateTotalBudgetSpent(transactions)} of {calculateTotalBudget(budgets)} limit
                </p>
                <div>
                    {budgets.length === 0 ? (
                        <p>No budgets</p>
                    ) : (
                        budgets.map((budget) => (
                            <div key={budget._id}>
                                <p>{budget.category}</p>
                                <p>{budget.maximum}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            
            {/* Recurring Bills */}
            <section>
                <h2>Recurring Bills</h2>
                <Link href="/recurring-bills">See Details</Link>
                <div>
                    {recurringBills.length === 0 && <p>No recurring bills</p>}
                    <div>
                        <p>Paid Bills</p>
                        <p>{calculatePaidBills(recurringBills)}</p>
                    </div>
                    <div>
                        <p>Total Upcoming</p>
                        <p>{calculateTotalUpcoming(recurringBills)}</p>
                    </div>
                    <div>
                        <p>Due Soon</p>
                        <p>{calculateDueSoon(recurringBills)}</p>
                    </div>
                </div>
            </section>
        </>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

import { fetchAllData } from './pageServices'
import currencyFormatter from '@/utils/currencyFormatter'
import formatDate from '@/utils/formatDate'
import formatTransactionAmount from '@/utils/formatTransactionAmount'
import DonutChart from '@/components/DonutChart'
import styles from './Overview.module.css'

export default function OverviewPage() {
    const CARD_ARROW_SIZE = 10
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
        const dueSoonDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) < dueSoonDate) {
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
            <h1 className={styles.overview__title}>Overview</h1>
            <section>
                <div className={`${styles['overview__account-item']} ${styles['overview__account-item--grey']}`}>
                    <p className={`${styles['overview__account-title']} ${styles['overview__account-title--white']}`}>Current Balance</p>
                    <p className={`${styles['overview__account-amount']} ${styles['overview__account-amount--white']}`}>{currencyFormatter(account?.current || 0)}</p>
                </div>
                <div className={`${styles['overview__account-item']} ${styles['overview__account-item--white']}`}>
                    <p className={`${styles['overview__account-title']} ${styles['overview__account-title--grey']}`}>Income</p>
                    <p className={`${styles['overview__account-amount']} ${styles['overview__account-amount--grey']}`}>{currencyFormatter(account?.income || 0)}</p>
                </div>
                <div className={`${styles['overview__account-item']} ${styles['overview__account-item--white']}`}>
                    <p className={`${styles['overview__account-title']} ${styles['overview__account-title--grey']}`}>Expenses</p>
                    <p className={`${styles['overview__account-amount']} ${styles['overview__account-amount--grey']}`}>{currencyFormatter(account?.expenses || 0)}</p>
                </div>
            </section>

            {/* Pots Overview */}
            <section className={`${styles.overview__card} ${styles.overview__pots}`}>
                <div className={styles['overview__card-header']}>
                    <h2 className={styles['overview__card-title']}>Pots</h2>
                    <Link className={styles['overview__card-link']} href='/pots'>
                        See Details
                        <span className={styles['overview__card-arrow']}>
                            <Image src='/assets/images/icon-caret-right.svg' alt='Arrow Right' width={CARD_ARROW_SIZE} height={CARD_ARROW_SIZE} />
                        </span>
                    </Link>
                </div>
                <div className={styles['overview__pots-saved']}>
                    <Image className={styles['overview__pots-image']} src='/assets/images/icon-pot.svg' alt='Pot' width={40} height={40} />
                    <div>
                        <p className={styles['overview__pots-text']}>Total Saved</p>
                        <p className={styles['overview__pots-amount']}>{currencyFormatter(calculateTotalPotSaved(pots))}</p>
                    </div>
                </div>
                <div className={styles['overview__card-list']}>
                    {/* Only Showing 4 Pots */}
                    {pots.length > 0 ? pots.slice(0, 4).map((pot) => (
                        <div className={styles['overview__card-item']} key={pot._id}>
                            <span style={{ backgroundColor: pot.theme }} className={styles['overview__card-indicator']}></span>
                            <p className={styles['overview__card-text']}>{pot.name}</p>
                            <p className={styles['overview__card-amount']}>{currencyFormatter(pot.total)}</p>
                        </div>
                    )) : <p className={styles['overview__card-text']}>No pots</p>}
                </div>
            </section>

            {/* Transactions Overview */}
            <section className={`${styles.overview__card} ${styles.overview__transactions}`}>
                <div className={styles['overview__card-header']}>
                    <h2 className={styles['overview__card-title']}>Transactions</h2>
                    <Link className={styles['overview__card-link']} href='/transactions'>
                        View All
                        <span className={styles['overview__card-arrow']}>
                            <Image src='/assets/images/icon-caret-right.svg' alt='Arrow Right' width={CARD_ARROW_SIZE} height={CARD_ARROW_SIZE} />
                        </span>
                    </Link>
                </div>
                <div>
                    {/* Only Showing 5 Transactions - Sorted */}
                    {transactions.length > 0 ? topFiveTransactions.map((transaction, index) => (
                        <div key={transaction._id}>
                            <div className={styles['overview__transactions-item']}>
                                <div className={styles['overview__transactions-details']}>
                                    <Image
                                        className={styles['overview__transactions-image']}
                                        src={transaction.avatar ? `/${transaction.avatar}` : '/assets/images/icon-payments.svg'}
                                        alt={transaction.name}
                                        width={32}
                                        height={32}
                                    />
                                    <p className={styles['overview__transactions-name']}>{transaction.name}</p>
                                </div>
                                <div className={styles['overview__transactions-breakdown']}>
                                    <p style={{ color: formatTransactionAmount(transaction.amount).color }} className={styles['overview__transactions-amount']}>
                                        {formatTransactionAmount(transaction.amount).formattedValue}
                                    </p>
                                    <p className={styles['overview__transactions-date']}>{formatDate(transaction.date)}</p>
                                </div>
                            </div>
                            {index !== topFiveTransactions.length - 1 && <hr className={styles['overview__transactions-hr']} />}
                        </div>
                    )) : <p className={styles['overview__card-text']}>No transactions</p>}
                </div>

            </section>

            {/* Budgets Overview */}
            <section className={`${styles.overview__card} ${styles.overview__budgets}`}>
                <div className={styles['overview__card-header']}>
                    <h2 className={styles['overview__card-title']}>Budgets</h2>
                    <Link className={styles['overview__card-link']} href='/budgets'>
                        See Details
                        <span className={styles['overview__card-arrow']}>
                            <Image src='/assets/images/icon-caret-right.svg' alt='Arrow Right' width={CARD_ARROW_SIZE} height={CARD_ARROW_SIZE} />
                        </span>
                    </Link>
                </div>
                <DonutChart
                    data={budgets}
                    height={240}
                    innerRadius={70}
                    total={calculateTotalBudgetSpent(transactions)}
                    limit={calculateTotalBudget(budgets)}
                />
                <div className={styles['overview__card-list']}>
                    {/* Only Showing 4 Budgets */}
                    {budgets.length > 0 ? budgets.slice(0, 4).map((budget) => (
                        <div className={styles['overview__card-item']} key={budget._id}>
                            <span style={{ backgroundColor: budget.theme }} className={styles['overview__card-indicator']}></span>
                            <p className={styles['overview__card-text']}>{budget.category}</p>
                            <p className={styles['overview__card-amount']}>{currencyFormatter(budget.maximum)}</p>
                        </div>
                    )) : <p className={styles['overview__card-text']}>No budgets</p>}
                </div>
            </section>


            {/* Recurring Bills */}
            <section className={`${styles.overview__card} ${styles.overview__bills}`}>
                <div className={styles['overview__card-header']}>
                    <h2 className={styles['overview__card-title']}>Recurring Bills</h2>
                    <Link className={styles['overview__card-link']} href='/recurring-bills'>
                        See Details
                        <span className={styles['overview__card-arrow']}>
                            <Image src='/assets/images/icon-caret-right.svg' alt='Arrow Right' width={CARD_ARROW_SIZE} height={CARD_ARROW_SIZE} />
                        </span>
                    </Link>
                </div>
                <div>
                    <div className={styles['overview__bills-item']}>
                    <span style={{ backgroundColor: '#277C78' }} className={styles['overview__card-indicator']}></span>
                        <p className={styles['overview__bills-text']}>Paid Bills</p>
                        <p className={styles['overview__bills-amount']}>{currencyFormatter(calculatePaidBills(recurringBills))}</p>
                    </div>
                    <div className={styles['overview__bills-item']}>
                    <span style={{ backgroundColor: '#F2CDAC' }} className={styles['overview__card-indicator']}></span>
                        <p className={styles['overview__bills-text']}>Total Upcoming</p>
                        <p className={styles['overview__bills-amount']}>{currencyFormatter(calculateTotalUpcoming(recurringBills))}</p>
                    </div>
                    <div className={styles['overview__bills-item']}>
                    <span style={{ backgroundColor: '#82C9D7' }} className={styles['overview__card-indicator']}></span>
                        <p className={styles['overview__bills-text']}>Due Soon</p>
                        <p className={styles['overview__bills-amount']}>{currencyFormatter(calculateDueSoon(recurringBills))}</p>
                    </div>
                </div>
            </section>
        </>
    )
}

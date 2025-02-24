'use client'
import { createContext, useState, useEffect, useContext } from 'react'
import { useSession } from 'next-auth/react'

import {
    defaultAccount,
    defaultTransactions,
    defaultBudgets,
    defaultPots,
} from './defaultData'

const ApplicationDataContext = createContext()

export function ApplicationDataProvider({ children }) {
    const { data: session, status } = useSession()
    const [data, setData] = useState({
        account: null,
        transactions: null,
        budgets: null,
        pots: null,
        reccuringBills: null,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchUserData() {
            try {
                // Promising to fetch user data
                const [accountRes, transactionsRes, budgetsRes, potsRes, recurringBillsRes] = await Promise.all([
                    fetch('/api/accounts'),
                    fetch('/api/transactions'),
                    fetch('/api/budgets'),
                    fetch('/api/pots'),
                    fetch('/api/recurring-bills')
                ])

                if (!accountRes.ok || !transactionsRes.ok || !budgetsRes.ok || !potsRes.ok || !recurringBillsRes.ok) {
                    throw new Error('Error fetching user data')
                }

                // Awaiting the response from the promises
                const userAccountData = await accountRes.json()
                const userTransactionsData = await transactionsRes.json()
                const userBudgetsData = await budgetsRes.json()
                const userPotsData = await potsRes.json()
                const userRecurringBillsData = await recurringBillsRes.json()

                setData({
                    account: userAccountData.accounts,
                    transactions: userTransactionsData.transactions,
                    budgets: userBudgetsData.budgets,
                    pots: userPotsData.pots,
                    recurringBills: userRecurringBillsData.recurringBills
                })
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        if (status === 'authenticated') {
            // Is there is a User, fetch their data
            fetchUserData()
        } else if (status === 'unauthenticated') {
            // If there is no User, use local storage - default data
            const defaultRecurringBills = defaultTransactions.filter(transaction => transaction.recurring)
            let storedAccount = localStorage.getItem('defaultAccount')
            let storedTransactions = localStorage.getItem('defaultTransactions')
            let storedBudgets = localStorage.getItem('defaultBudgets')
            let storedPots = localStorage.getItem('defaultPots')
            let storedRecurringBills = localStorage.getItem('defaultRecurringBills')

            if (!storedAccount)
                localStorage.setItem('defaultAccount', JSON.stringify(defaultAccount))
            if (!storedTransactions)
                localStorage.setItem('defaultTransactions', JSON.stringify(defaultTransactions))
            if (!storedBudgets)
                localStorage.setItem('defaultBudgets', JSON.stringify(defaultBudgets))
            if (!storedPots)
                localStorage.setItem('defaultPots', JSON.stringify(defaultPots))
            if (!storedRecurringBills)
                localStorage.setItem('defaultRecurringBills', JSON.stringify(defaultRecurringBills))

            setData({
                account: JSON.parse(localStorage.getItem('defaultAccount')),
                transactions: JSON.parse(localStorage.getItem('defaultTransactions')),
                budgets: JSON.parse(localStorage.getItem('defaultBudgets')),
                pots: JSON.parse(localStorage.getItem('defaultPots')),
                recurringBills: JSON.parse(localStorage.getItem('defaultRecurringBills'))
            })
            setIsLoading(false)
        }
    }, [status])

    function updateData(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
        const stateKey = key.replace('default', '').toLowerCase()
        setData((prev) => ({
            ...prev,
            [stateKey]: value,
        }))
    }

    // Setters for context state
    function setAccount(account) {
        updateData('defaultAccount', account)
    }

    async function setTransactions(newTransaction) {
        if (!session) {
          // Get stored transactions or default to an empty array if not set
          const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions')) || [];
          // Create a new transaction with an id (for example purposes)
          const transactionWithId = { ...newTransaction, _id: `t${storedTransactions.length + 1}` };
          // Update local storage with the new transaction appended
          localStorage.setItem('defaultTransactions', JSON.stringify([...storedTransactions, transactionWithId]));
          // Use the transaction with id for updating state
          newTransaction = transactionWithId;
        }
      
        // Ensure that if state.transactions is null, we treat it as an empty array
        setData((prev) => ({
          ...prev,
          transactions: [...(prev.transactions || []), newTransaction],
        }));
      }
      

    function setBudgets(budgets) {
        updateData('defaultBudgets', budgets)
    }

    function setPots(pots) {
        updateData('defaultPots', pots)
    }

    function setRecurringBills(recurringBills) {
        updateData('defaultRecurringBills', recurringBills)
    }

    return (
        <ApplicationDataContext.Provider
            value={{
                data,
                isLoading,
                setAccount,
                setTransactions,
                setBudgets,
                setPots,
                setRecurringBills,
            }}
        >
            {children}
        </ApplicationDataContext.Provider>
    )
}

export function useApplicationData() {
    return useContext(ApplicationDataContext)
}

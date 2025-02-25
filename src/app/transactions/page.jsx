'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { fetchTransactions } from './transactionServices'
import TransactionCreate from './TransactionCreate'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import Pagination from './Pagination'

export default function TransactionsPage() {
    const PAGE_SIZE = 10
    const { data: session, status } = useSession()
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [currentTransactions, setCurrentTransactions] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isTransactionCreateOpen, setIsTransactionCreateOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get transactions from either local storage or the API
    useEffect(() => {
        if (status === 'loading') return
        async function handleFetchTransactions() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchTransactions(session)
                setTransactions(data.transactions)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error in transactions occurred.')
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchTransactions()
    }, [session, status])

    // Initial setup: update categories, currentTransactions, and totalPages when transactions change
    useEffect(() => {
        if (!transactions || transactions.length === 0) return

        const uniqueCategories = [...new Set(transactions.map(tx => tx.category))]
        setCategories(uniqueCategories)

        setCurrentTransactions(transactions.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(transactions.length / PAGE_SIZE))
    }, [transactions])

    // Pagination: update currentTransactions when page changes
    useEffect(() => {
        if (!transactions) return
        const start = (page - 1) * PAGE_SIZE
        const end = page * PAGE_SIZE
        setCurrentTransactions(transactions.slice(start, end))
    }, [page, transactions])

    // Pagination: handle page change
    const handlePageChange = (direction) => {
        if (direction === 'prev' && page > 1) {
            setPage(page - 1)
        } else if (direction === 'next' && page < totalPages) {
            setPage(page + 1)
        }
    }

    // Filters: handle transactions update
    const handleTransactionsUpdate = (updatedTransactions) => {
        setTransactions(updatedTransactions)
        setPage(1)
        setCurrentTransactions(updatedTransactions.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(updatedTransactions.length / PAGE_SIZE))
    }

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h1>Transactions</h1>
            <button onClick={() => setIsTransactionCreateOpen(true)}>
                + Add New Transaction
            </button>

            {/* Transaction Create Modal */}
            {isTransactionCreateOpen && (
                <TransactionCreate
                    setIsTransactionCreateOpen={setIsTransactionCreateOpen}
                    setTransactions={setTransactions}
                />
            )}

            {/* Transaction Filters - name input, sort by, categories */}
            <TransactionFilters
                transactions={transactions}
                categories={categories}
                onTransactionsUpdate={handleTransactionsUpdate}
            />

            {/* Displays transactions */}
            <TransactionList transactions={currentTransactions} />

            {/* Pagenation controls */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    )
}

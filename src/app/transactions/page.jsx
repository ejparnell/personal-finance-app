'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { fetchTransactions, deleteTransaction } from './transactionServices'
import { defaultCategories } from '@/app/defaultData'
import useWindowSize from '@/hooks/useWindowSize'
import TransactionCreate from './TransactionCreate'
import TransactionUpdate from './TransactionUpdate'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import Pagination from './Pagination'
import styles from './Transactions.module.css'

export default function TransactionsPage() {
    const PAGE_SIZE = 10
    const { data: session, status } = useSession()
    const { width } = useWindowSize()
    const [allTransactions, setAllTransactions] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const [currentTransactions, setCurrentTransactions] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isTransactionCreateOpen, setIsTransactionCreateOpen] = useState(false)
    const [isTransactionUpdateOpen, setIsTransactionUpdateOpen] = useState(false)
    const [transactionToUpdate, setTransactionToUpdate] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])

    // Fetch transactions initially
    useEffect(() => {
        if (status === 'loading') return

        async function fetchAndSetTransactions() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchTransactions(session)
                setAllTransactions(data.transactions)
                setFilteredTransactions(data.transactions)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error in transactions occurred.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchAndSetTransactions()
    }, [session, status])

    // Update pagination whenever the filtered list changes
    useEffect(() => {
        if (!filteredTransactions || filteredTransactions.length === 0) return
        setCategories(defaultCategories)
        setCurrentTransactions(filteredTransactions.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(filteredTransactions.length / PAGE_SIZE))
    }, [filteredTransactions])

    // Update currentTransactions when page changes
    useEffect(() => {
        if (!filteredTransactions) return
        const start = (page - 1) * PAGE_SIZE
        const end = page * PAGE_SIZE
        setCurrentTransactions(filteredTransactions.slice(start, end))
    }, [page, filteredTransactions])

    // Handles pagination - prev/next page turning
    function handlePageChange(direction) {
        if (direction === 'prev' && page > 1) {
            setPage(page - 1)
        } else if (direction === 'next' && page < totalPages) {
            setPage(page + 1)
        }
    }

    // Handles updating transactions after filters are applied
    function handleTransactionsUpdate(updatedTransactions) {
        setFilteredTransactions(updatedTransactions)
        setPage(1)
        setCurrentTransactions(updatedTransactions.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(updatedTransactions.length / PAGE_SIZE))
    }

    // Handles the delete action for a transaction
    async function handleTransactionDelete(transactionId) {
        try {
            const data = await deleteTransaction(session, transactionId)
            setAllTransactions(data.transactions)
            setFilteredTransactions(data.transactions)
        } catch (error) {
            console.error(error)
            setError(error.message || 'An error occurred while deleting the transaction.')
        }
    }

    // Handler to open the update modal
    function handleEditTransaction(transaction) {
        setTransactionToUpdate(transaction)
        setIsTransactionUpdateOpen(true)
    }

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <header className={styles.transactions__header}>
                <h1>Transactions</h1>
            </header>

            {/* Transaction Create Modal */}
            {isTransactionCreateOpen && (
                <TransactionCreate
                    setIsTransactionCreateOpen={setIsTransactionCreateOpen}
                    setAllTransactions={setAllTransactions}
                    setFilteredTransactions={setFilteredTransactions}
                    session={session}
                    categories={categories}
                />
            )}

            {/* Transaction Update Modal */}
            {isTransactionUpdateOpen && transactionToUpdate && (
                <TransactionUpdate
                    transaction={transactionToUpdate}
                    setIsTransactionUpdateOpen={setIsTransactionUpdateOpen}
                    setAllTransactions={setAllTransactions}
                    setFilteredTransactions={setFilteredTransactions}
                    session={session}
                    categories={categories}
                />
            )}
            <section className={styles.transactions__detail}>
                {/* Transaction Filters */}
                <TransactionFilters
                    allTransactions={allTransactions}
                    transactions={filteredTransactions}
                    categories={categories}
                    onTransactionsUpdate={handleTransactionsUpdate}
                />

                {/* Displays transactions */}
                <TransactionList
                    transactions={currentTransactions}
                    handleTransactionDelete={handleTransactionDelete}
                    handleTransactionEdit={handleEditTransaction}
                />

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
        </>
    )
}

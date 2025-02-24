'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { useApplicationData } from '@/context/ApplicationDataContext'
import { TransactionCreate } from './TransactionCreate'

export default function TransactionsPage() {
    const PAGE_SIZE = 10
    const { data: { transactions, setTransactions }, isLoading } = useApplicationData()
    const [categories, setCategories] = useState([])
    const [currentTransaction, setCurrentTransaction] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isTransactionCreateOpen, setIsTransactionCreateOpen] = useState(false)

    // Initial setup
    useEffect(() => {
        if (!transactions) return
        if (transactions.length > 0) {
            // Creating a list of unique categories for the dropdown menu
            const categories = transactions.map(transaction => transaction.category)
            const uniqueCategories = [...new Set(categories)]
            setCategories(uniqueCategories)

            // Setting the first page of the pagination
            const firstPage = transactions.slice(0, PAGE_SIZE)
            setCurrentTransaction(firstPage)

            // Setting the total number of pages
            setTotalPages(Math.ceil(transactions.length / PAGE_SIZE))
        }
    }, [transactions])

    // Pagination logic
    useEffect(() => {
        if (!transactions) return
        const start = (page - 1) * PAGE_SIZE
        const end = page * PAGE_SIZE
        const newPage = transactions.slice(start, end)
        setCurrentTransaction(newPage)
    }, [page, transactions])

    // Handles the page turn
    function handlePageChange(direction) {
        if (direction === 'prev') {
            if (page === 1) return
            setPage(prevPage => prevPage - 1)
        } else {
            if (page === totalPages) return
            setPage(prevPage => prevPage + 1)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    // Handles sorting transactions - latest, oldest, a to z, z to a, highest, lowest
    function handleSortBy(event) {
        const sortBy = event.target.value
        let sortedTransactions = []

        switch (sortBy) {
            case 'latest':
                sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'oldest':
                sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'aToZ':
                sortedTransactions = [...transactions].sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'zToA':
                sortedTransactions = [...transactions].sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'highest':
                sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount)
                break
            case 'lowest':
                sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount)
                break
            default:
                sortedTransactions = transactions
        }

        setTransactions(sortedTransactions)
        setPage(1)
        setCurrentTransaction(sortedTransactions.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(sortedTransactions.length / PAGE_SIZE))
    }

    // handles category change - all, or a specific category - based on transactions.category
    function handleCategoryChange(event) {
        const category = event.target.value
        let filteredTransactions = []

        if (category === 'all') {
            filteredTransactions = transactions
        } else {
            filteredTransactions = transactions.filter(transaction => transaction.category === category)
        }

        setCurrentTransaction(filteredTransactions.slice(0, PAGE_SIZE))
        setPage(1)
        setTotalPages(Math.ceil(filteredTransactions.length / PAGE_SIZE))
    }

    // handles search by name
    function handleNameSearch(event) {
        const search = event.target.value
        const filteredTransactions = transactions.filter(transaction => transaction.name.toLowerCase().includes(search.toLowerCase()))

        setCurrentTransaction(filteredTransactions.slice(0, PAGE_SIZE))
        setPage(1)
        setTotalPages(Math.ceil(filteredTransactions.length / PAGE_SIZE))
    }

    function handleOpenTransactionCreate() {
        setIsTransactionCreateOpen(true)
    }

    return (
        <>
            <h1>Transactions</h1>
            <button onClick={handleOpenTransactionCreate}>+ Add New Transaction</button>
            {isTransactionCreateOpen && <TransactionCreate setIsTransactionCreateOpen={setIsTransactionCreateOpen} setTransactions={setTransactions} />}
            <div>
                {/* Search by name */}
                <input type='text' placeholder='Search transactions' onChange={handleNameSearch} />
                <Image src='/assets/images/icon-search.svg' alt='Search' width={20} height={20} />

                {/* Sort by dropdown menu */}
                <label htmlFor='sortBy'>Sort by</label>
                <select id='sortBy' onChange={handleSortBy}>
                    <option value='latest'>Latest</option>
                    <option value='oldest'>Oldest</option>
                    <option value='aToZ'>A to Z</option>
                    <option value='zToA'>Z to A</option>
                    <option value='highest'>Highest</option>
                    <option value='lowest'>Lowest</option>
                </select>

                {/* Category dropdown menu */}
                {categories.length > 0 ?
                    <>
                        <label htmlFor='category'>Category</label>
                        <select id='category' onChange={handleCategoryChange}>
                            <option value='all'>All</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </> : <p>Need to have transactions.</p>
                }
            </div>

            <div>
                {/* Current Transactions */}
                <ul>
                    {currentTransaction.map(transaction => (
                        <li key={transaction.date}>
                            <Image
                                src={`/${transaction.avatar}`}
                                alt={transaction.name}
                                width={20}
                                height={20}
                            />
                            <p>{transaction.name}</p>
                            <p>{transaction.category}</p>
                            <p>{transaction.date}</p>
                            <p>{transaction.amount}</p>
                        </li>
                    ))}
                </ul>
                {totalPages > 1 && <div>
                    <button onClick={() => handlePageChange('prev')}>Previous</button>
                    {/* buttons for each page */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <p key={i}>{i + 1}</p>
                    ))}
                    <button onClick={() => handlePageChange('next')}>Next</button>
                </div>}
            </div>
        </>
    )
}
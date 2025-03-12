import { useState } from 'react'
import Image from 'next/image'

import useWindowSize from '@/hooks/useWindowSize'
import Dropdown from '@/components/Dropdown'
import styles from './TransactionFilters.module.css'

const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'aToZ', label: 'A to Z' },
    { value: 'zToA', label: 'Z to A' },
    { value: 'highest', label: 'Highest' },
    { value: 'lowest', label: 'Lowest' },
]

export default function TransactionFilters({ allTransactions, categories, onTransactionsUpdate }) {
    const [sortBy, setSortBy] = useState('latest')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const { width } = useWindowSize()

    // Update transactions based on filters
    function updateTransactions(sort = sortBy, category = selectedCategory, search = searchTerm) {
        let filteredTransactions = allTransactions

        if (category !== 'all') {
            filteredTransactions = filteredTransactions.filter(tx => tx.category === category)
        }

        if (search) {
            filteredTransactions = filteredTransactions.filter(tx =>
                tx.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        switch (sort) {
            case 'latest':
                filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'oldest':
                filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'aToZ':
                filteredTransactions.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'zToA':
                filteredTransactions.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'highest':
                filteredTransactions.sort((a, b) => b.amount - a.amount)
                break
            case 'lowest':
                filteredTransactions.sort((a, b) => a.amount - b.amount)
                break
            default:
                break
        }

        // Return the newly filtered transactions
        onTransactionsUpdate(filteredTransactions)
    }

    // Sort by dropdown change handler
    function handleSortByChange(newSortBy) {
        setSortBy(newSortBy)
        updateTransactions(newSortBy, selectedCategory, searchTerm)
    }

    // Category dropdown change handler
    function handleCategoryChange(newCategory) {
        setSelectedCategory(newCategory)
        updateTransactions(sortBy, newCategory, searchTerm)
    }

    // Search input change handler
    function handleSearchChange(event) {
        const search = event.target.value.toLowerCase()
        setSearchTerm(search)
        updateTransactions(sortBy, selectedCategory, search)
    }

    return (
        <div className={styles.filter__container}>
            {/* Search Input */}
            <div>
                <input
                    className={styles.search__input}
                    type='text'
                    placeholder={(width >= 768 && width < 1024) ? 'Search tran...' : 'Search transaction'}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Image
                    className={styles.search__icon}
                    src='/assets/images/icon-search.svg'
                    alt='Search'
                    width={15} 
                    height={15}
                />
            </div>

            {/* Sort Dropdown */}
            <div className={styles.transactions__dropdowns}>
                <Dropdown
                    options={sortOptions}
                    onSelect={handleSortByChange}
                    image='/assets/images/icon-sort-mobile.svg'
                    alt='Sort by'
                    label={width >= 768 ? 'Sort by' : ''}
                />

                {/* Category Filter Dropdown */}
                <div>
                    {categories && categories.length > 0 ? (
                        <>
                            <Dropdown
                                options={[{ value: 'all', label: 'All' }, ...categories.map(category => ({ value: category, label: category }))]}
                                onSelect={handleCategoryChange}
                                image='/assets/images/icon-filter-mobile.svg'
                                alt='Category'
                                label={width >= 768 ? 'Category' : ''}
                            />
                        </>
                    ) : (
                        <p>No transactions</p>
                    )}
                </div>
            </div>
        </div>
    )
}

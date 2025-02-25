import { useState } from 'react'
import Image from 'next/image'

export default function TransactionFilters({ allTransactions, categories, onTransactionsUpdate }) {
    const [sortBy, setSortBy] = useState('latest')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

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
    function handleSortByChange(event) {
        const newSortBy = event.target.value
        setSortBy(newSortBy)
        updateTransactions(newSortBy, selectedCategory, searchTerm)
    }

    // Category dropdown change handler
    function handleCategoryChange(event) {
        const newCategory = event.target.value
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
        <div>
            {/* Search Input */}
            <div>
                <input
                    type="text"
                    placeholder="Search transactions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Image src="/assets/images/icon-search.svg" alt="Search" width={20} height={20} />
            </div>

            {/* Sort Dropdown */}
            <div>
                <label htmlFor="sortBy">Sort by</label>
                <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="aToZ">A to Z</option>
                    <option value="zToA">Z to A</option>
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                </select>
            </div>

            {/* Category Filter Dropdown */}
            <div>
                {categories && categories.length > 0 ? (
                    <>
                        <label htmlFor="category">Category</label>
                        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="all">All</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <p>Need to have transactions.</p>
                )}
            </div>
        </div>
    )
}

import { useState } from 'react'

export default function RecurringBillFilters({ allRecurringBills, onRecurringBillsUpdate }) {
    const [sortBy, setSortBy] = useState('latest')
    const [searchTerm, setSearchTerm] = useState('')

    // Update transactions based on filters
    function updateRecurringBills(sort = sortBy, search = searchTerm) {
        let filteredRecurringBills = allRecurringBills

        if (search) {
            filteredRecurringBills = filteredRecurringBills.filter(bill =>
                bill.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        switch (sort) {
            case 'latest':
                filteredRecurringBills.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'oldest':
                filteredRecurringBills.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'aToZ':
                filteredRecurringBills.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'zToA':
                filteredRecurringBills.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'highest':
                filteredRecurringBills.sort((a, b) => b.amount - a.amount)
                break
            case 'lowest':
                filteredRecurringBills.sort((a, b) => a.amount - b.amount)
                break
            default:
                break
        }

        // Return the newly filtered transactions
        onRecurringBillsUpdate(filteredRecurringBills)
    }

    // Sort by dropdown change handler
    function handleSortByChange(event) {
        const newSortBy = event.target.value
        setSortBy(newSortBy)
        updateRecurringBills(newSortBy, searchTerm)
    }

    // Search input change handler
    function handleSearchChange(event) {
        const newSearchTerm = event.target.value
        setSearchTerm(newSearchTerm)
        updateRecurringBills(sortBy, newSearchTerm)
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div>
                <label>Sort by:</label>
                <select value={sortBy} onChange={handleSortByChange}>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="aToZ">A to Z</option>
                    <option value="zToA">Z to A</option>
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                </select>
            </div>
        </div>
    )
}
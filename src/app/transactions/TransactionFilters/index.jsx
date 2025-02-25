import Image from 'next/image'

export default function TransactionFilters({ transactions, categories, onTransactionsUpdate }) {
    const handleSortByChange = (event) => {
        const sortBy = event.target.value
        let sortedTransactions = []

        switch (sortBy) {
            case 'latest':
                sortedTransactions = [...transactions].sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                )
                break
            case 'oldest':
                sortedTransactions = [...transactions].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )
                break
            case 'aToZ':
                sortedTransactions = [...transactions].sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
                break
            case 'zToA':
                sortedTransactions = [...transactions].sort((a, b) =>
                    b.name.localeCompare(a.name)
                )
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

        onTransactionsUpdate(sortedTransactions)
    }

    const handleCategoryChange = (event) => {
        const category = event.target.value
        const filteredTransactions =
            category === 'all'
                ? transactions
                : transactions.filter(tx => tx.category === category)
        onTransactionsUpdate(filteredTransactions)
    }

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase()
        const filteredTransactions = transactions.filter(tx =>
            tx.name.toLowerCase().includes(searchTerm)
        )
        onTransactionsUpdate(filteredTransactions)
    }

    return (
        <div>
            {/* Search Input */}
            <div>
                <input
                    type="text"
                    placeholder="Search transactions"
                    onChange={handleSearchChange}
                />
                <Image src="/assets/images/icon-search.svg" alt="Search" width={20} height={20} />
            </div>

            {/* Sort Dropdown */}
            <div>
                <label htmlFor="sortBy">Sort by</label>
                <select id="sortBy" onChange={handleSortByChange}>
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
                        <select id="category" onChange={handleCategoryChange}>
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

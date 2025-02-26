'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { fetchRecurringBills } from './recurringBillServices'
import { defaultCategories } from '@/app/defaultData'
import RecurringBillFilters from './RecurringBillFilter'
import RecurringBillList from './RecurringBillList'
import RecurringBillCreate from './RecurringBillCreate'
import Pagination from './Pagination'
import RecurringBillUpdate from './RecurringBillUpdate'
import RecurringBillConfirmDelete from './RecurringBillConfirmDelete'

export default function RecurringBillsPage() {
    const PAGE_SIZE = 10
    const { data: session, status } = useSession()
    const [allRecurringBills, setAllRecurringBills] = useState([])
    const [filteredRecurringBills, setFilteredRecurringBills] = useState([])
    const [currentRecurringBills, setCurrentRecurringBills] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isRecurringBillCreateOpen, setIsRecurringBillCreateOpen] = useState(false)
    const [isRecurringBillUpdateOpen, setIsRecurringBillUpdateOpen] = useState(false)
    const [isRecurringBillDeleteOpen, setIsRecurringBillDeleteOpen] = useState(false)
    const [recurringBillToUpdate, setRecurringBillToUpdate] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch recurring bills initially
    useEffect(() => {
        if (status === 'loading') return

        async function getRecurringBills() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchRecurringBills(session)
                setAllRecurringBills(data.recurringBills)
                setFilteredRecurringBills(data.recurringBills)
            } catch (error) {
                console.error(error)
                setError(error.message || 'An error occurred while fetching user data')
            } finally {
                setIsLoading(false)
            }
        }

        getRecurringBills()
    }, [session, status])

    // Update pagination whenever the filtered list changes
    useEffect(() => {
        if (!filteredRecurringBills || filteredRecurringBills.length === 0) return
        setCurrentRecurringBills(filteredRecurringBills.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(filteredRecurringBills.length / PAGE_SIZE))
    }, [filteredRecurringBills])

    // Update currentRecurringBills when page changes
    useEffect(() => {
        if (!filteredRecurringBills || filteredRecurringBills.length === 0) return
        const start = (page - 1) * PAGE_SIZE
        const end = start + PAGE_SIZE
        setCurrentRecurringBills(filteredRecurringBills.slice(start, end))
    }, [page, filteredRecurringBills])

    // Handles pagination - prev/next page turning
    function handlePageChange(direction) {
        if (direction === 'prev' && page > 1) {
            setPage(page - 1)
        } else if (direction === 'next' && page < totalPages) {
            setPage(page + 1)
        }
    }

    function handleRecurringBillsUpdate(updateRecurringBills) {
        setFilteredRecurringBills(updateRecurringBills)
        setPage(1)
        setCurrentRecurringBills(updateRecurringBills.slice(0, PAGE_SIZE))
        setTotalPages(Math.ceil(updateRecurringBills.length / PAGE_SIZE))
    }

    // Calculate total recurring bills
    function calculateTotalRecurringBills(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return 0
        const calculated = recurringBillsArr.reduce((total, recurringBill) => total + recurringBill.amount, 0)
        return Math.abs(calculated)
    }

    // Calculate paid bills
    function calculatePaidBills(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return { count: 0, total: 0 }
        let count = 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) < new Date()) {
                count++
                total += bill.amount
            }
            return total
        }, 0)

        return { count, total: Math.abs(calculated) }
    }

    // Calculate total upcoming
    function calculateTotalUpcoming(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return { count: 0, total: 0 }
        let count = 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) > new Date()) {
                count++
                total += bill.amount
            }
            return total
        }, 0)

        return { count, total: Math.abs(calculated) }
    }

    // Calculate due soon
    function calculateDueSoon(recurringBillsArr) {
        if (!recurringBillsArr || recurringBillsArr.length === 0) return { count: 0, total: 0 }
        let count = 0
        const calculated = recurringBillsArr.reduce((total, bill) => {
            if (new Date(bill.date) < new Date() + 7) {
                count++
                total += bill.amount
            }
            return total
        }, 0)

        return { count, total: Math.abs(calculated) }
    }

    function openRecurringBillUpdate(recurringBill) {
        setRecurringBillToUpdate(recurringBill)
        setIsRecurringBillUpdateOpen(true)
    }

    function openRecurringBillDelete(recurringBill) {
        setRecurringBillToUpdate(recurringBill)
        setIsRecurringBillDeleteOpen(true)
    }

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h1>Recurring Bills</h1>
            <button onClick={() => setIsRecurringBillCreateOpen(true)}>
                + Add New Recurring Bill
            </button>

            {/* Recurring Bill Create Modal */}
            {isRecurringBillCreateOpen && (
                <RecurringBillCreate
                    setIsRecurringBillCreateOpen={setIsRecurringBillCreateOpen}
                    setAllRecurringBills={setAllRecurringBills}
                    setFilteredRecurringBills={setFilteredRecurringBills}
                    session={session}
                    categories={defaultCategories}
                    handleRecurringBillsUpdate={handleRecurringBillsUpdate}
                />
            )}

            {/* Recurring Bill Update Modal */}
            {isRecurringBillUpdateOpen && <RecurringBillUpdate
                recurringBill={recurringBillToUpdate}
                setIsRecurringBillEditOpen={setIsRecurringBillUpdateOpen}
                setAllRecurringBills={setAllRecurringBills}
                handleRecurringBillsUpdate={handleRecurringBillsUpdate}
                session={session}
            />}

            {/* Recurring Bill Delete Modal */}
            {isRecurringBillDeleteOpen && <RecurringBillConfirmDelete
                recurringBill={recurringBillToUpdate}
                setIsRecurringBillDeleteOpen={setIsRecurringBillDeleteOpen}
                setAllRecurringBills={setAllRecurringBills}
                handleRecurringBillsUpdate={handleRecurringBillsUpdate}
                session={session}
            />}

            {/* Total Bills Overview */}
            <section>
                <p>Total Bills</p>
                <p>{calculateTotalRecurringBills(allRecurringBills)}</p>
            </section>

            {/* Bills Summary */}
            <section>
                <p>Summary</p>
                <p>Paid Bills {calculatePaidBills(allRecurringBills).count} {calculatePaidBills(allRecurringBills).total}</p>
                <p>Total Upcoming {calculateTotalUpcoming(allRecurringBills).count} {calculateTotalUpcoming(allRecurringBills).total}</p>
                <p>Due Soon {calculateDueSoon(allRecurringBills).count} {calculateDueSoon(allRecurringBills).total}</p>
            </section>

            {/* Recurring Bills Filter */}
            <RecurringBillFilters
                allRecurringBills={allRecurringBills}
                recurringBills={filteredRecurringBills}
                categories={defaultCategories}
                onRecurringBillsUpdate={handleRecurringBillsUpdate}
            />

            {/* Recurring Bills List */}
            {allRecurringBills.length > 0 ? <RecurringBillList
                recurringBills={currentRecurringBills}
                openRecurringBillUpdate={openRecurringBillUpdate}
                openRecurringBillDelete={openRecurringBillDelete}
            /> : <div>No recurring bills.</div>}

            {/* Pagination controls */}
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
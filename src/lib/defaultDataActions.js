import { cookies } from 'next/headers'

import {
    defaultAccount,
    defaultTransactions,
    defaultBudgets,
    defaultPots,
} from './defaultData'

// Getters and Setters for all default data
// Default data is set in cookies

// Get all default data
export async function getAllDefaultData() {
    const cookieStore = await cookies()
    const defaultData = cookieStore.get('defaultData')

    if (!defaultData) {
        const res = await fetch('http://localhost:3000/api/default-data')
        const json = await res.json()
        return json.data
    } else {
        return JSON.parse(defaultData)
    }
}

// Get default account
export async function getDefaultAccount() {
    const localDefaultAccount = localStorage.getItem('defaultAccount')

    if (!localDefaultAccount) {
        try {
            localStorage.setItem('defaultAccount', JSON.stringify(defaultAccount))
            return { account: defaultAccount }
        } catch (error) {
            console.error(error)
            return 'Error getting default account'
        }
    }

    return JSON.parse(localDefaultAccount)
}

// Set default account
export async function setDefaultAccount(account) {
    try {
        localStorage.setItem('defaultAccount', JSON.stringify(account))
        return { account }
    } catch (error) {
        console.error(error)
        return 'Error setting default account'
    }
}

// Get default transactions
export async function getDefaultTransactions() {
    const localDefaultTransactions = localStorage.getItem('defaultTransactions')

    if (!localDefaultTransactions) {
        try {
            localStorage.setItem('defaultTransactions', JSON.stringify(defaultTransactions))
            return { transactions: defaultTransactions }
        } catch (error) {
            console.error(error)
            return 'Error getting default transactions'
        }
    }

    return JSON.parse(localDefaultTransactions)
}

// Set default transactions
export async function setDefaultTransactions(transactions) {
    try {
        localStorage.setItem('defaultTransactions', JSON.stringify(transactions))
        return { transactions }
    } catch (error) {
        console.error(error)
        return 'Error setting default transactions'
    }
}

// Get default budgets
export async function getDefaultBudgets() {
    const localDefaultBudgets = localStorage.getItem('defaultBudgets')

    if (!localDefaultBudgets) {
        try {
            localStorage.setItem('defaultBudgets', JSON.stringify(defaultBudgets))
            return { budgets: defaultBudgets }
        } catch (error) {
            console.error(error)
            return 'Error getting default budgets'
        }
    }

    return JSON.parse(localDefaultBudgets)
}

// Set default budgets
export async function setDefaultBudgets(budgets) {
    try {
        localStorage.setItem('defaultBudgets', JSON.stringify(budgets))
        return { budgets }
    } catch (error) {
        console.error(error)
        return 'Error setting default budgets'
    }
}

// Get default pots
export async function getDefaultPots() {
    const localDefaultPots = localStorage.getItem('defaultPots')

    if (!localDefaultPots) {
        try {
            localStorage.setItem('defaultPots', JSON.stringify(defaultPots))
            return { pots: defaultPots }
        } catch (error) {
            console.error(error)
            return 'Error getting default pots'
        }
    }

    return JSON.parse(localDefaultPots)
}

// Set default pots
export async function setDefaultPots(pots) {
    try {
        localStorage.setItem('defaultPots', JSON.stringify(pots))
        return { pots }
    } catch (error) {
        console.error(error)
        return 'Error setting default pots'
    }
}

import { defaultPots } from '@/app/defaultData'

// Fetch pots from the API or localStorage
export async function fetchPots(session) {
    if (session) {
        const response = await fetch('/api/pots')

        if (!response.ok) {
            throw new Error('Failed to fetch pots')
        }

        return response.json()
    } else {
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))

        if (!storedPots) {
            localStorage.setItem('defaultPots', JSON.stringify(defaultPots))
            return { pots: defaultPots }
        }

        return { pots: storedPots || defaultPots }
    }
}

// Create a new pot in the API or localStorage
export async function createPot(session, formData) {
    if (session) {
        const response = await fetch('/api/pots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (!response.ok) {
            throw new Error('Failed to create pot')
        }

        return response.json()
    } else {
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))
        formData._id = Math.random().toString(36).substr(2, 9)
        const updatedPots = [...storedPots, formData]
        localStorage.setItem('defaultPots', JSON.stringify(updatedPots))

        return { pots: updatedPots }
    }
}

// Update a pot in the API or localStorage
export async function updatePot(session, potId, formData) {
    if (session) {
        const response = await fetch(`/api/pots/${potId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (!response.ok) {
            throw new Error('Failed to update pot')
        }

        return response.json()
    } else {
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))
        const updatedPots = storedPots.map(pot => {
            if (pot._id === potId) {
                return { ...pot, ...formData }
            }
            return pot
        })
        localStorage.setItem('defaultPots', JSON.stringify(updatedPots))

        return { pots: updatedPots }
    }
}

// Delete a pot in the API or localStorage
export async function deletePot(session, potId) {
    if (session) {
        const response = await fetch(`/api/pots/${potId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete pot')
        }

        return response.json()
    } else {
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))
        const updatedPots = storedPots.filter(pot => pot._id !== potId)
        localStorage.setItem('defaultPots', JSON.stringify(updatedPots))

        return { pots: updatedPots }
    }
}
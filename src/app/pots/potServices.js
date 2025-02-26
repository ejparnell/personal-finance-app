export async function fetchPots(session) {
    if (session) {
        const response = await fetch('/api/pots')
        if (!response.ok) {
            throw new Error('Failed to fetch pots')
        }
        return response.json()
    } else {
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))
        return { pots: storedPots || defaultPots }
    }
}

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
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
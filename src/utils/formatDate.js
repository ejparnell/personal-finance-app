export default function formatDate(isoString) {
    const date = new Date(isoString)
    const day = date.getUTCDate()
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    const year = date.getUTCFullYear()
    
    return `${day} ${month} ${year}`
}
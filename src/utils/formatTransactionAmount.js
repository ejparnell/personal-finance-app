// Intakes a positive or negative number
// Returns and object - { color: string, formattedValue: string }
// uses the currencyFormatter to format the value
// if the value is positive, the color is #277C78, and there is a + sign before the value
// if the value is negative, the color is #201F24, and there is a - sign before the value
import currencyFormatter from './currencyFormatter'

export default function formatTransactionAmount(value) {
    const color = value >= 0 ? '#277C78' : '#201F24'
    const sign = value >= 0 ? '+' : '-'
    const formattedValue = currencyFormatter(Math.abs(value))
    return { color, formattedValue: `${sign}${formattedValue}` }  
}
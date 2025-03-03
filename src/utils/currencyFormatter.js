// From - https://stackoverflow.com/questions/55556221/how-do-you-format-a-number-to-currency-when-using-react-native-expo
const defaultOptions = {
    significantDigits: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbol: '$'
}

export default function currencyFormatter(value, options) {
    if (typeof value !== 'number') value = 0.0
    options = { ...defaultOptions, ...options }
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return `${options.symbol} ${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )}${options.decimalSeparator}${decimal}`
}
// From - https://stackoverflow.com/questions/55556221/how-do-you-format-a-number-to-currency-when-using-react-native-expo
const defaultOptions = {
    significantDigits: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbol: '$'
}

export default function currencyFormatter(value, options) {
    if (typeof value !== 'number') value = 0.0;
    options = { ...defaultOptions, ...options };

    const formattedValue = value.toFixed(options.significantDigits);
    const parts = formattedValue.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandsSeparator);

    if (options.significantDigits === 0) {
        return `${options.symbol} ${integerPart}`;
    }
    
    const decimalPart = parts[1];
    return `${options.symbol} ${integerPart}${options.decimalSeparator}${decimalPart}`;
}

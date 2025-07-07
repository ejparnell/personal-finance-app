export function toMinorUnit(amount: number): number {
    return Math.round(amount * 100);
}

export function fromMinorUnit(amount: number): number {
    return amount / 100;
}

export function formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount / 100);

    return formatted;
}

export function roundToCents(amount: number): number {
    return Math.round(amount * 100) / 100;
}

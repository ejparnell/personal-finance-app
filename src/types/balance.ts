export type BalanceType = {
    _id: string;
    userId: string;
    currentBalance: number;
    income: number;
    expenses: number;
};

export type BalancesState = {
    error?: string | null;
    balances?: BalanceType[];
};

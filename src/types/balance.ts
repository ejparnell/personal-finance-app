export type BalanceType = {
    _id: string;
    user: string;
    currentBalance: number;
    income: number;
    expenses: number;
};

export type BalancesState = {
    balanceError?: string | null;
    success?: boolean;
    balances?: BalanceType[];
};

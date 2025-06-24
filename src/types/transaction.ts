export type TransactionType = {
    _id: string;
    user: string;
    avatar: string;
    name: string;
    category: string;
    date: string;
    amount: number;
    recurring: boolean;
};

export type TransactionsState = {
    transactionError?: string | null;
    success?: boolean;
    transactions?: TransactionType[];
};
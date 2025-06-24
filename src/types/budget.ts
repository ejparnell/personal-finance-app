export type BudgetType = {
    _id: string;
    user: string;
    category: string;
    maximum: number;
    theme: string;
};

export type BudgetsState = {
    budgetError?: string | null;
    success?: boolean;
    budgets?: BudgetType[];
};

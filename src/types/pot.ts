export type PotLean = {
    _id: string;
    user: string;
    name: string;
    target: number;
    total: number;
    theme: string;
    createdAt: string;
    updatedAt: string;
};

export type PotsState = {
    potError?: string | null;
    potSuccess?: boolean;
    pots?: PotLean[];
};

export type PotState = {
    potError?: string | null;
    potSuccess?: boolean;
    pot?: PotLean | null;
};

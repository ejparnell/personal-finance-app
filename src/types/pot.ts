export type PotType = {
    _id: string;
    user: string;
    name: string;
    target: number;
    total: number;
    theme: string;
};

export type PotsState = {
    potError?: string | null;
    success?: boolean;
    pots?: PotType[];
};

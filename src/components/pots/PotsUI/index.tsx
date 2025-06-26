'use client';

import { useState } from "react";
import { PotType } from "@/types/pot";
import PotsCreate from "../PotsCreate";

interface PotsUIProps {
    onLoadPots: PotType[];
    error?: string | null;
}

export default function PotsUI({ onLoadPots, error }: PotsUIProps) {
    const [pots, setPots] = useState<PotType[]>(onLoadPots || []);

    function handleAddPot(newPot: PotType) {
        setPots((prevPots) => [...prevPots, newPot]);
    }
    
    console.log("PotsUI rendered with pots:", pots);

    return (
        <div>
            <PotsCreate handleAddPot={handleAddPot} />
        </div>
    );
}
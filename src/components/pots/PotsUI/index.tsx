'use client';

import { useState } from "react";
import { PotType } from "@/types/pot";
import PotsCreate from "../PotsCreate";
import PotsList from "../PotsList";

interface PotsUIProps {
    onLoadPots: PotType[];
    error?: string | null;
}

export default function PotsUI({ onLoadPots, error }: PotsUIProps) {
    const [pots, setPots] = useState<PotType[]>(onLoadPots || []);

    function handleAddPot(newPot: PotType) {
        setPots((prevPots) => [...prevPots, newPot]);
    }

    function handleEditPot(updatedPot: PotType) {
        setPots((prevPots) =>
            prevPots.map((pot) => (pot._id === updatedPot._id ? updatedPot : pot))
        );
    }

    function handleDeletePot(potId: string) {
        setPots((prevPots) => prevPots.filter((pot) => pot._id !== potId));
    }
    
    console.log("PotsUI rendered with pots:", pots);

    return (
        <div>
            <PotsCreate handleAddPot={handleAddPot} />

            <PotsList pots={pots} error={error} handleEditPot={handleEditPot} handleDeletePot={handleDeletePot} />
        </div>
    );
}
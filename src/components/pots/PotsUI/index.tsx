'use client';

import { PotType } from '@/types/pot';
import PotsCreate from '../PotsCreate';
import PotsList from '../PotsList';

interface PotsUIProps {
    onLoadPots: PotType[];
    error?: string | null;
}

export default function PotsUI({ onLoadPots, error }: PotsUIProps) {
    return (
        <div>
            <PotsCreate />
            <PotsList error={error} onLoadPots={onLoadPots} />
        </div>
    );
}

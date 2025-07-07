'use client';

import { useEffect } from 'react';
import { PotLean } from '@/types/pot';
import Pot from './Pot';
import styles from './PotsList.module.css';
import { usePot } from '@/context/PotProvider';

interface PotsListProps {
    onLoadPots?: PotLean[];
    error?: string | null;
}

export default function PotsList({ onLoadPots, error }: PotsListProps) {
    const { pots, setPots, isSubmitting } = usePot();

    useEffect(() => {
        if (onLoadPots) {
            setPots(onLoadPots);
        }
    }, [onLoadPots, setPots]);

    if (isSubmitting) {
        return <div>Loading pots...</div>;
    }

    return (
        <div className={styles.potsListContainer}>
            {error && <p>Error: {error}</p>}
            {pots && pots.length > 0 ? (
                pots.map((pot) => <Pot key={pot._id} pot={pot} />)
            ) : (
                <p>No pots available</p>
            )}
        </div>
    );
}

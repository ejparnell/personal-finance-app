import { PotType } from "@/types/pot";
import Pot from "./Pot";
import styles from "./PotsList.module.css";

interface PotsListProps {
    pots?: PotType[];
    error?: string | null;
    handleEditPot: (updatedPot: PotType) => void;
    handleDeletePot: (potId: string) => void;
}

export default function PotsList({ pots, error, handleEditPot, handleDeletePot }: PotsListProps) {
    return (
        <div className={styles.potsListContainer}>
            {error && <p>Error: {error}</p>}
            {pots && pots.length > 0 ? (
                pots.map((pot) => <Pot key={pot._id} pot={pot} handleEditPot={handleEditPot} handleDeletePot={handleDeletePot} />)
            ) : (
                <p>No pots available</p>
            )}
        </div>
    );
}
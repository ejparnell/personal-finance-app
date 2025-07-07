import {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from 'react';
import { PotLean } from '@/types/pot';
import { useMessage } from '@/context/MessageProvider';
import { PotInput } from '@/schemas/pot';
import { createPot, getPots, editPot, deletePot } from '@/services/potServices';

interface PotContextType {
    pots: PotLean[];
    loading?: boolean;
    error?: string | null;
    isSubmitting?: boolean;
    setPots: (pots: PotLean[]) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    handleAddPot: (potData: PotInput) => void;
    handleEditPot: (potId: string, potData: PotInput) => void;
    handleDeletePot: (potId: string) => void;
    // handleAddPot: (pot: PotLean) => void;
    // handleEditPot: (pot: PotLean) => void;
    // handleDeletePot: (potId: string) => void;
}

const PotContext = createContext<PotContextType>({
    pots: [],
    loading: true,
    error: null,
    isSubmitting: false,
    setPots: () => {},
    handleAddPot: () => {},
    setIsSubmitting: () => {},
    handleEditPot: () => {},
    handleDeletePot: () => {},
});

export function PotProvider({ children }: { children: ReactNode }) {
    const { handleSetMessages } = useMessage();
    const [pots, setPots] = useState<PotLean[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // handleDeletePot, get potId and send it to API
    useEffect(() => {
        async function fetchPots() {
            setError(null);

            try {
                const response = await getPots();
                if (response.success) {
                    setPots(response.data || []);
                } else {
                    console.error('Failed to fetch pots:', response.error);
                    handleSetMessages('Failed to fetch pots', 'error');
                }
            } catch (error) {
                console.error('Failed to fetch pots:', error);
                handleSetMessages('Failed to fetch pots', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchPots();
    }, []);

    async function handleAddPot(potData: PotInput) {
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await createPot(potData);
            if (response.success) {
                setPots((prevPots) => [...prevPots, response.data as PotLean]);
                handleSetMessages('Pot created successfully', 'success');
            } else {
                console.error('Failed to create pot:', response.error);
                handleSetMessages('Failed to create pot', 'error');
            }
        } catch (error) {
            console.error('Failed to create pot:', error);
            handleSetMessages('Failed to create pot', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleEditPot(potId: string, potData: PotInput) {
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await editPot(potId, potData);
            if (response.success) {
                setPots((prevPots) =>
                    prevPots.map((pot) =>
                        pot._id === potId ? (response.data as PotLean) : pot
                    )
                );
                handleSetMessages('Pot updated successfully', 'success');
            } else {
                console.error('Failed to update pot:', response.error);
                handleSetMessages('Failed to update pot', 'error');
            }
        } catch (error) {
            console.error('Failed to update pot:', error);
            handleSetMessages('Failed to update pot', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeletePot(potId: string) {
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await deletePot(potId);
            if (response.success) {
                setPots((prevPots) =>
                    prevPots.filter((pot) => pot._id !== potId)
                );
                handleSetMessages('Pot deleted successfully', 'success');
            } else {
                console.error('Failed to delete pot:', response.error);
                handleSetMessages('Failed to delete pot', 'error');
            }
        } catch (error) {
            console.error('Failed to delete pot:', error);
            handleSetMessages('Failed to delete pot', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <PotContext.Provider
            value={{
                pots,
                loading,
                error,
                isSubmitting,
                setPots,
                setIsSubmitting,
                handleAddPot,
                handleEditPot,
                handleDeletePot,
            }}
        >
            {children}
        </PotContext.Provider>
    );
}

export function usePot() {
    const context = useContext(PotContext);
    if (!context) {
        throw new Error('usePot must be used within a PotProvider');
    }
    return context;
}

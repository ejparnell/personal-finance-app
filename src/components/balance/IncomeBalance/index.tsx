'use client';

import { useState } from 'react';
import { fetchWrapper } from '@/lib/utils';
import { useMessage } from '@/context/MessageProvider';
import BalanceCard from '../BalanceCard';
import BalanceCardHeader from '../BalanceCardHeader';
import Modal from '@/components/shared/Modal';
import BaseInput from '@/components/shared/BaseInput';
import SubmitButton from '@/components/shared/SubmitButton';

interface IncomeProps {
    income: number;
}

export default function IncomeBalance({ income }: IncomeProps) {
    const { handleSetMessages } = useMessage();
    const [incomeValue, setIncomeValue] = useState<number>(income || 0);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleOpenEdit() {
        setIsEditOpen(true);
    }

    function handleCloseEdit() {
        setIsEditOpen(false);
    }

    function handleIncomeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setIncomeValue(value);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper('/api/balance', {
                body: JSON.stringify({ income: incomeValue }),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to update income:', response.error);
                handleSetMessages(
                    response.error || 'Failed to update income',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Income updated successfully', 'success');
        } catch (error) {
            console.error('Error updating income:', error);
            handleSetMessages('Failed to update income', 'error');
        } finally {
            setIsLoading(false);
            handleCloseEdit();
        }
    }

    return (
        <BalanceCard balance={incomeValue}>
            <BalanceCardHeader name="Income" handleOpenEdit={handleOpenEdit} />
            <Modal
                isOpen={isEditOpen}
                title="Edit Current Balance"
                subtitle="Update your current balance"
                handleClose={handleCloseEdit}
                handleSubmit={handleSubmit}
            >
                <BaseInput
                    type="number"
                    name="income"
                    label="Monthly Income"
                    value={incomeValue}
                    handleChange={handleIncomeChange}
                    placeholder="Enter your monthly income"
                    required
                    helperText="Please enter a valid number"
                />
                <SubmitButton disabled={isLoading} text="Update Income" />
            </Modal>
        </BalanceCard>
    );
}

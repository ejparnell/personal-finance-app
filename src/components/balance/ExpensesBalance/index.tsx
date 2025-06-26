'use client';

import { useState } from 'react';
import { fetchWrapper } from '@/lib/utils';
import { useMessage } from '@/context/MessageProvider';
import BalanceCard from '../BalanceCard';
import BalanceCardHeader from '../BalanceCardHeader';
import Modal from '@/components/shared/Modal';
import BaseInput from '@/components/shared/BaseInput';
import SubmitButton from '@/components/shared/SubmitButton';

interface ExpensesBalanceProps {
    expenses: number;
}

export default function ExpensesBalance({ expenses }: ExpensesBalanceProps) {
    const { handleSetMessages } = useMessage();
    const [expensesValue, setExpensesValue] = useState<number>(expenses || 0);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleOpenEdit() {
        setIsEditOpen(true);
    }

    function handleCloseEdit() {
        setIsEditOpen(false);
    }

    function handleExpensesChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setExpensesValue(value);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper('/api/balance', {
                body: JSON.stringify({ expenses: expensesValue }),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to update expenses:', response.error);
                handleSetMessages(
                    response.error || 'Failed to update expenses',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Expenses updated successfully', 'success');
        } catch (error) {
            console.error('Error updating expenses:', error);
            handleSetMessages('Failed to update expenses', 'error');
        } finally {
            setIsLoading(false);
            handleCloseEdit();
        }
    }

    return (
        <>
            <BalanceCard balance={expensesValue}>
                <BalanceCardHeader
                    name="Expenses"
                    handleOpenEdit={handleOpenEdit}
                />
            </BalanceCard>

            <Modal
                isOpen={isEditOpen}
                title="Edit Current Balance"
                subtitle="Update your current balance"
                handleClose={handleCloseEdit}
                handleSubmit={handleSubmit}
            >
                <BaseInput
                    type="number"
                    name="expenses"
                    label="Expenses"
                    value={expensesValue}
                    handleChange={handleExpensesChange}
                    placeholder="Enter your expenses"
                    required
                    helperText="Please enter a valid number"
                />
                <SubmitButton disabled={isLoading} text="Update Expenses" />
            </Modal>
        </>
    );
}

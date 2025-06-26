/**
 * CurrentBalance Component
 *
 * - handles displaying the current balance of the user
 *   - passed in via props from the parent component
 * - handles edits to the current balance
 * - handles resetting the current balance
 */
'use client';

import { useState } from 'react';
import { fetchWrapper } from '@/lib/utils';
import { useMessage } from '@/context/MessageProvider';
import BalanceCard from '../BalanceCard';
import BalanceCardHeader from '../BalanceCardHeader';
import Modal from '@/components/shared/Modal';
import BaseInput from '@/components/shared/BaseInput';
import SubmitButton from '@/components/shared/SubmitButton';

interface CurrentBalanceProps {
    currentBalance: number;
}

export default function CurrentBalance({
    currentBalance,
}: CurrentBalanceProps) {
    const { handleSetMessages } = useMessage();
    const [balance, setBalance] = useState<number>(currentBalance || 0);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleOpenEdit() {
        setIsEditOpen(true);
    }

    function handleCloseEdit() {
        setIsEditOpen(false);
    }

    function handleBalanceChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setBalance(value);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper('/api/balance', {
                body: JSON.stringify({ currentBalance: balance }),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to update balance:', response.error);
                handleSetMessages(response.error || 'Failed to update balance', 'error');
                setIsLoading(false);
                return;
            }

            handleSetMessages('Balance updated successfully', 'success');
        } catch (error) {
            console.error('Error updating balance:', error);
            handleSetMessages('Failed to update balance', 'error');
        } finally {
            setIsLoading(false);
            handleCloseEdit();
        }
    }

    return (
        <>
            <BalanceCard balance={balance} theme="dark">
                <BalanceCardHeader name="Current Balance" theme="dark" handleOpenEdit={handleOpenEdit} />
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
                        name='currentBalance'
                        label="Current Balance"
                        value={balance}
                        handleChange={handleBalanceChange}
                        placeholder="Enter your current balance"
                        required={true}
                        helperText="Please enter a valid number"
                    />
                    <SubmitButton disabled={isLoading} text='Update Balance' />
                </Modal>
        </>
    );
}

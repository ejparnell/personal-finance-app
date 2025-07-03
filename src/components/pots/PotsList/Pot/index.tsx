import { useState, useEffect } from 'react';
import { PotType } from '@/types/pot';
import { formatCurrency, fetchWrapper } from '@/lib/utils';
import EditButton from '@/components/shared/EditButton';
import Card from '@/components/shared/Card';
import Modal from '@/components/shared/Modal';
import styles from './Pot.module.css';
import BaseInput from '@/components/shared/BaseInput';
import { PotInput } from '@/schemas/pot';
import Dropdown from '@/components/shared/Dropdown';
import { ThemeOption, themeOptions } from '@/types/theme';
import SubmitButton from '@/components/shared/SubmitButton';
import { useMessage } from '@/context/MessageProvider';
import DeleteButton from '@/components/shared/DeleteButton';

interface PotProps {
    pot: PotType;
    handleEditPot: (updatedPot: PotType) => void;
    handleDeletePot: (potId: string) => void;
}

export default function Pot({ pot, handleEditPot, handleDeletePot }: PotProps) {
    const { handleSetMessages } = useMessage();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingMoney, setIsAddingMoney] = useState(false);
    const [isWithdrawingMoney, setIsWithdrawingMoney] = useState(false);
    const [formData, setFormData] = useState<PotInput>({
        name: pot.name,
        target: pot.target,
        total: pot.total,
        theme: pot.theme,
    });
    const [options, setOptions] = useState<ThemeOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ThemeOption>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPct, setCurrentPct] = useState<number>(0);
    const [addedPct, setAddedPct] = useState<number>(0);
    const [withdrawPct, setWithdrawPct] = useState<number>(0);

    useEffect(() => {
        setCurrentPct((pot.total / pot.target) * 100);
        setAddedPct((formData.total / pot.target) * 100);
        setWithdrawPct((formData.total / pot.target) * 100);
    }, [pot.total, pot.target, formData.total]);

    useEffect(() => {
        const formattedOptions = themeOptions.map((option) => ({
            name: option.name,
            className: option.className,
            selected: false,
        }));
        setOptions(formattedOptions);

        setSelectedOption(formattedOptions[0]);
    }, []);

    function handleEditClick() {
        setIsEditing(true);
    }

    function handleDeleteClick() {
        setIsDeleting(true);
    }

    function handleAddMoneyClick() {
        setIsAddingMoney(true);
    }

    function handleWithdrawMoneyClick() {
        setIsWithdrawingMoney(true);
    }

    function handleCloseActions() {
        setIsEditing(false);
        setIsDeleting(false);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleThemeSelect(option: string) {
        const selected = options.find((opt) => opt.name === option);
        if (selected) {
            setSelectedOption(selected);
            setFormData((prevData) => ({
                ...prevData,
                theme: selected.className,
            }));
        }
    }

    async function handleSaveChanges(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper(`/api/pots/${pot._id}`, {
                body: JSON.stringify(formData),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to save changes:', response.error);
                handleSetMessages(
                    response.error || 'Failed to save changes',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Changes saved successfully', 'success');
            const data = response.data as PotInput;
            setFormData({
                name: data.name,
                target: data.target,
                total: data.total,
                theme: data.theme,
            });

            handleEditPot(response.data as PotType);

            console.log('Changes saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving changes:', error);
            handleSetMessages('Failed to save changes', 'error');
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    }

    async function handleDelete() {
        setIsLoading(true);

        try {
            const response = await fetchWrapper(`/api/pots/${pot._id}`, {
                method: 'DELETE',
            });

            if (!response.success) {
                console.error('Failed to delete pot:', response.error);
                handleSetMessages(
                    response.error || 'Failed to delete pot',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleDeletePot(pot._id);
            handleSetMessages('Pot deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting pot:', error);
            handleSetMessages('Failed to delete pot', 'error');
        } finally {
            setIsLoading(false);
            setIsDeleting(false);
        }
    }

    async function handleAddMoney(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper(`/api/pots/${pot._id}`, {
                body: JSON.stringify({ total: formData.total }),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to add money:', response.error);
                handleSetMessages(
                    response.error || 'Failed to add money',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Money added successfully', 'success');
            const updatedPot = response.data as PotType;
            handleEditPot(updatedPot);

            setFormData((prevData) => ({
                ...prevData,
                total: 0,
            }));
        } catch (error) {
            console.error('Error adding money:', error);
            handleSetMessages('Failed to add money', 'error');
            setFormData((prevData) => ({
                ...prevData,
                total: 0,
            }));
        } finally {
            setIsLoading(false);
            setIsAddingMoney(false);
        }
    }

    async function handleWithdrawMoney(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const calculatedTotal = Math.max(pot.total - formData.total, 0);
            const response = await fetchWrapper(`/api/pots/${pot._id}`, {
                body: JSON.stringify({ total: calculatedTotal }),
                method: 'PATCH',
            });

            if (!response.success) {
                console.error('Failed to withdraw money:', response.error);
                handleSetMessages(
                    response.error || 'Failed to withdraw money',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Money withdrawn successfully', 'success');
            const updatedPot = response.data as PotType;
            handleEditPot(updatedPot);

            setFormData((prevData) => ({
                ...prevData,
                total: 0,
            }));
        } catch (error) {
            console.error('Error withdrawing money:', error);
            handleSetMessages('Failed to withdraw money', 'error');
            setFormData((prevData) => ({
                ...prevData,
                total: 0,
            }));
        } finally {
            setIsLoading(false);
            setIsWithdrawingMoney(false);
        }
    }

    return (
        <>
            <Card
                title={pot.name}
                color={pot.theme}
                handleOpenEdit={handleEditClick}
                handleOpenDelete={handleDeleteClick}
            >
                <div className={styles.potContent}>
                    <div className={styles.potTextWrapper}>
                        <p className={styles.potTotalLabel}>Total Saved</p>
                        <p className={styles.potTotalValue}>
                            {formatCurrency(pot.total)}
                        </p>
                    </div>

                    <div className={styles.potContent}>
                        <div className={styles.potProgressBar}>
                            <div
                                className={`${styles.potProgressCurrent} ${styles[pot.theme]}`}
                                style={{
                                    width: `${currentPct}%`,
                                }}
                            />
                        </div>
                        <div className={styles.potTextWrapper}>
                            <p className={styles.potProgressText}>
                                {((pot.total / pot.target) * 100).toFixed(2)}%
                            </p>
                            <p className={styles.potProgressText}>
                                Target of {formatCurrency(pot.target)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.potActions}>
                    <EditButton handleClick={handleAddMoneyClick}>
                        + Add Money
                    </EditButton>
                    <EditButton handleClick={handleWithdrawMoneyClick}>Withdraw</EditButton>
                </div>
            </Card>

            {isEditing && (
                <Modal
                    isOpen={isEditing}
                    title={`Edit: ${pot.name}`}
                    subtitle="If your saving targets change, feel free to update your pots."
                    handleClose={handleCloseActions}
                    handleSubmit={handleSaveChanges}
                >
                    <BaseInput
                        type="text"
                        name="name"
                        label="Pot Name"
                        value={formData.name}
                        handleChange={handleInputChange}
                        required
                        helperText={`${30 - formData.name.length} characters left`}
                    />

                    <BaseInput
                        type="number"
                        name="target"
                        label="Target Amount"
                        value={formData.target}
                        handleChange={handleInputChange}
                        required
                    />

                    <Dropdown
                        options={options}
                        selectedOption={selectedOption}
                        label="Color Tag"
                        handleSelect={handleThemeSelect}
                    />

                    <SubmitButton
                        disabled={!formData.name || !formData.target}
                        text="Save Changes"
                    />
                </Modal>
            )}

            {isDeleting && (
                <Modal
                    isOpen={isDeleting}
                    title={`Delete '${pot.name}'`}
                    subtitle="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
                    handleClose={handleCloseActions}
                >
                    <DeleteButton handleClick={handleDelete}>
                        Yes, Confirm Deletion
                    </DeleteButton>

                    <p
                        onClick={handleCloseActions}
                        className={styles.deleteBackText}
                    >
                        No, Go Back
                    </p>
                </Modal>
            )}

            {isAddingMoney && (
                <Modal
                    isOpen={isAddingMoney}
                    title={`Add to ${pot.name}`}
                    subtitle="Add money to your pot to help you reach your savings target."
                    handleClose={() => setIsAddingMoney(false)}
                    handleSubmit={handleAddMoney}
                >
                    <div className={styles.potContent}>
                        <div className={styles.potProgressBar}>
                            <div
                                className={`${styles.potProgressCurrent} ${styles[pot.theme]}`}
                                style={{
                                    width: `${(pot.total / pot.target) * 100}%`,
                                }}
                            />
                            <div
                                className={styles.potProgressAddition}
                                style={{
                                    left: `${currentPct}%`,
                                    width: `${addedPct}%`,
                                }}
                            />
                        </div>
                        <div className={styles.potTextWrapper}>
                            <p className={styles.potProgressText}>
                                {((pot.total / pot.target) * 100).toFixed(2)}%
                            </p>
                            <p className={styles.potProgressText}>
                                Target of {formatCurrency(pot.target)}
                            </p>
                        </div>
                    </div>

                    <BaseInput
                        type="number"
                        name="total"
                        label="Amount to Add"
                        value={formData.total}
                        handleChange={handleInputChange}
                        required
                    />

                    <SubmitButton
                        disabled={!formData.total || isLoading}
                        text="Confirm Addition"
                    />
                </Modal>
            )}

            {isWithdrawingMoney && (
                <Modal
                    isOpen={isWithdrawingMoney}
                    title={`Withdraw from ${pot.name}`}
                    subtitle="Withdraw money from your pot. This will reduce your total saved amount."
                    handleClose={() => setIsWithdrawingMoney(false)}
                    handleSubmit={handleWithdrawMoney}
                >
                    <div className={styles.potContent}>
                        <div className={styles.potProgressBar}>
                            <div
                                className={`${styles.potProgressCurrent} ${styles[pot.theme]}`}
                                style={{
                                    width: `${(pot.total / pot.target) * 100}%`,
                                }}
                            />
                            <div
                                className={styles.potProgressWithdrawal}
                                style={{
                                    left: `${currentPct - withdrawPct}%`,
                                    width: `${withdrawPct}%`,
                                }}
                            />
                        </div>
                        <div className={styles.potTextWrapper}>
                            <p className={styles.potProgressText}>
                                {((pot.total / pot.target) * 100).toFixed(2)}%
                            </p>
                            <p className={styles.potProgressText}>
                                Target of {formatCurrency(pot.target)}
                            </p>
                        </div>
                    </div>
                    
                    <BaseInput
                        type="number"
                        name="total"
                        label="Amount to Withdraw"
                        value={formData.total}
                        handleChange={handleInputChange}
                        required
                    />

                    <SubmitButton
                        disabled={!formData.total || isLoading}
                        text="Confirm Withdrawal"
                    />
                </Modal>
            )}
        </>
    );
}

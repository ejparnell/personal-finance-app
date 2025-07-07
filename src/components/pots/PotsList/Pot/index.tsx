import { useState, useEffect } from 'react';
import { PotLean } from '@/types/pot';
import {
    formatCurrency,
    fromMinorUnit,
    toMinorUnit,
} from '@/lib/currencyFunctions';
import EditButton from '@/components/shared/EditButton';
import Card from '@/components/shared/Card';
import Modal from '@/components/shared/Modal';
import styles from './Pot.module.css';
import BaseInput from '@/components/shared/BaseInput';
import { PotInput } from '@/schemas/pot';
import Dropdown from '@/components/shared/Dropdown';
import { ThemeOption, themeOptions } from '@/types/theme';
import SubmitButton from '@/components/shared/SubmitButton';
import DeleteButton from '@/components/shared/DeleteButton';
import { usePot } from '@/context/PotProvider';

interface PotProps {
    pot: PotLean;
}

export default function Pot({ pot }: PotProps) {
    const { handleEditPot, handleDeletePot, isSubmitting, setIsSubmitting } =
        usePot();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingMoney, setIsAddingMoney] = useState(false);
    const [isWithdrawingMoney, setIsWithdrawingMoney] = useState(false);
    const [formData, setFormData] = useState<PotInput>({
        name: pot.name,
        target: fromMinorUnit(pot.target),
        total: fromMinorUnit(pot.total),
        theme: pot.theme,
    });
    const [options, setOptions] = useState<ThemeOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ThemeOption>();
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

        const userSelectedOption = formattedOptions.find(
            (option) => option.className === pot.theme
        );

        setSelectedOption(userSelectedOption || formattedOptions[0]);
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
        setIsSubmitting(true);

        try {
            formData.target = toMinorUnit(parseInt(formData.target.toString()));
            formData.total = toMinorUnit(parseInt(formData.total.toString()));
            await handleEditPot(pot._id, formData);
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSubmitting(false);
            setIsEditing(false);
        }
    }

    async function handleDelete() {
        setIsSubmitting(true);

        try {
            await handleDeletePot(pot._id);
        } catch (error) {
            console.error('Error deleting pot:', error);
        } finally {
            setIsSubmitting(false);
            setIsDeleting(false);
        }
    }

    async function handleAddMoney(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const formattedTotal = toMinorUnit(
                parseInt(formData.total.toString())
            );
            formData.target = toMinorUnit(parseInt(formData.target.toString()));
            await handleEditPot(pot._id, {
                ...formData,
                total: pot.total + formattedTotal,
            });
        } catch (error) {
            console.error('Error adding money:', error);
        } finally {
            setIsSubmitting(false);
            setIsAddingMoney(false);
        }
    }

    async function handleWithdrawMoney(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const calculatedTotal =
                pot.total - toMinorUnit(parseInt(formData.total.toString()));
            formData.target = toMinorUnit(parseInt(formData.target.toString()));
            await handleEditPot(pot._id, {
                ...formData,
                total: calculatedTotal,
            });
        } catch (error) {
            console.error('Error withdrawing money:', error);
        } finally {
            setIsSubmitting(false);
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
                                className={`${styles.potProgress} ${styles[pot.theme]}`}
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
                    <EditButton handleClick={handleWithdrawMoneyClick}>
                        Withdraw
                    </EditButton>
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

                    <SubmitButton disabled={isSubmitting} text="Save Changes" />
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
                                className={`${styles.potProgressCurrent} ${styles.potProgress}`}
                                style={{
                                    width: `${(pot.total / pot.target) * 100}%`,
                                }}
                            />
                            <div
                                className={`${styles.potProgressAddition} ${styles.potProgress}`}
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
                        disabled={isSubmitting}
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
                                className={`${styles.potProgressCurrent} ${styles.potProgress}`}
                                style={{
                                    width: `${(pot.total / pot.target) * 100}%`,
                                }}
                            />
                            <div
                                className={`${styles.potProgressWithdrawal} ${styles.potProgress}`}
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
                        disabled={isSubmitting}
                        text="Confirm Withdrawal"
                    />
                </Modal>
            )}
        </>
    );
}

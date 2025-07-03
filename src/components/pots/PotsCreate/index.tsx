'use client';

import { useState, useEffect } from "react";
import NewButton from "@/components/shared/NewButton";
import Modal from "@/components/shared/Modal";
import BaseInput from "@/components/shared/BaseInput";
import { PotType } from "@/types/pot";
import { PotInput } from "@/schemas/pot";
import { ThemeOption, themeOptions } from "@/types/theme";
import { fetchWrapper } from "@/lib/utils";
import { useMessage } from "@/context/MessageProvider";
import Dropdown from "@/components/shared/Dropdown";
import SubmitButton from "@/components/shared/SubmitButton";

interface PotsCreateProps {
    handleAddPot: (pot: PotType) => void;
}

export default function PotsCreate({ handleAddPot }: PotsCreateProps) {
    const { handleSetMessages } = useMessage();
    const charLimit = 30;
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<PotInput>({
        name: '',
        target: 0,
        total: 0,
        theme: themeOptions[0].name,
    });
    const [options, setOptions] = useState<ThemeOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ThemeOption>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const formattedOptions = themeOptions.map((option) => ({
            name: option.name,
            className: option.className,
            selected: false,
        }));
        setOptions(formattedOptions);

        setSelectedOption(formattedOptions[0]);
    },[]);

    function handleCreateOpen() {
        setIsCreateOpen(true);
    }

    function handleCreateClose() {
        setIsCreateOpen(false);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleCreatePot(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWrapper('/api/pots', {
                body: JSON.stringify(formData),
                method: 'POST',
            })

            if (!response.success) {
                console.error('Failed to create pot:', response.error);
                handleSetMessages(
                    response.error || 'Failed to create pot',
                    'error'
                );
                setIsLoading(false);
                return;
            }

            handleSetMessages('Pot created successfully', 'success');
            handleAddPot(response.data as PotType);
        } catch (error) {
            console.error('Error creating pot:', error);
            handleSetMessages('Failed to create pot', 'error');
        } finally {
            setIsLoading(false);
            setFormData({
                name: '',
                target: 0,
                total: 0,
                theme: themeOptions[0].className,
            });
            setSelectedOption(options[0]);
            handleCreateClose();
        }
    }

    function handleThemeSelect(optionName: string) {
        const selected = options.find((option) => option.name === optionName);
        if (selected) {
            setSelectedOption(selected);
            setFormData((prevData) => ({
                ...prevData,
                theme: selected.className,
            }));
        }
    }

    return (
        <div>
            <NewButton handleClick={handleCreateOpen}>
                + Add New Pot
            </NewButton>

            {isCreateOpen && (
                <Modal
                    isOpen={isCreateOpen}
                    title='Create New Pot'
                    subtitle="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
                    handleClose={handleCreateClose}
                    handleSubmit={handleCreatePot}
                >
                    <BaseInput
                    type='text'
                    name='name'
                    label='Pot Name'
                    value={formData.name}
                    handleChange={handleInputChange}
                    placeholder='e.g. Rainy Days'
                    required
                    helperText={`${charLimit - formData.name.length} characters left`}
                    />

                    <BaseInput
                        type='number'
                        name='target'
                        label='Target Amount'
                        value={formData.target}
                        handleChange={handleInputChange}
                        placeholder='e.g. 1000'
                        required
                    />

                    <Dropdown
                        options={options}
                        selectedOption={selectedOption}
                        label='Color Tag'
                        handleSelect={handleThemeSelect}
                    />

                    <SubmitButton 
                        disabled={isLoading || !formData.name || !formData.target}
                        text='Create Pot'
                    />
                </Modal>
            )}
        </div>
    );
}
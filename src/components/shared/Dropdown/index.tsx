import { useState } from 'react';
import Image from 'next/image';
import { ThemeOption } from '@/types/theme';
import styles from './Dropdown.module.css';

interface DropdownProps {
    options: ThemeOption[];
    label: string;
    selectedOption: ThemeOption | undefined;
    handleSelect: (option: string) => void;
}

export default function Dropdown({
    options,
    label,
    selectedOption,
    handleSelect,
}: DropdownProps) {
    const iconsSize = 16;
    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown() {
        setIsOpen((prev) => !prev);
    }

    function onSelect(optionName: string) {
        handleSelect(optionName);
        setIsOpen(false);
    }

    return (
        <div className={styles.dropdownContainer}>
            <p className={styles.dropdownLabel}>{label}</p>
            <div onClick={toggleDropdown} className={styles.dropdownSelector}>
                <div className={styles.dropdownSelected}>
                    {selectedOption?.className && (
                        <div
                            className={`${styles.dropDownColorIndicator} ${styles[selectedOption.className]}`}
                        />
                    )}
                    {selectedOption?.name || 'Select an option'}
                </div>
                <Image
                    src="/icons/icon-caret-down.svg"
                    alt="Toggle Dropdown"
                    width={iconsSize}
                    height={iconsSize}
                />
            </div>

            {isOpen && (
                <div className={styles.dropdownOptions}>
                    {options.map((option) => (
                        <div key={option.name}>
                            <div
                                onClick={() => onSelect(option.name)}
                                className={styles.dropdownOption}
                            >
                                <div className={styles.dropdownOptionText}>
                                    {option?.className && (
                                        <div
                                            className={`${styles.dropDownColorIndicator} ${styles[option.className]}`}
                                        />
                                    )}
                                    {option.name}
                                </div>
                                
                            </div>
                            {options[options.length - 1].name !==
                                    option.name && (
                                    <div className={styles.dropdownDivider} />
                                )}
                            </div>
                    ))}
                </div>
            )}
        </div>
    );
}

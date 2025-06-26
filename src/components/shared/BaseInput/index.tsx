import React from 'react';
import styles from './BaseInput.module.css';

interface BaseInputProps {
    type: string;
    name: string;
    label: string;
    value?: string | number;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    error?: string;
    prefixImage?: string;
    suffixImage?: string;
}

export default function BaseInput({
    type,
    name,
    label,
    value,
    handleChange,
    placeholder = '',
    required = false,
    disabled = false,
    helperText,
}: BaseInputProps) {
    return (
        <div className={styles.baseInputWrapper}>
            <label htmlFor={name} className={styles.baseInputLabel}>
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={styles.baseInputField}
            />
            {helperText && (
                <p className={styles.baseInputHelperText}>{helperText}</p>
            )}
        </div>
    );
}

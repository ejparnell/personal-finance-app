import Image, { StaticImageData } from 'next/image';
import presets from '@/styles/presets.module.css';
import styles from './Input.module.css';

interface InputProps {
    type: string;
    name: string;
    id: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayName?: string;
    backIcon?: StaticImageData;
    clientErrors?: string[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function Input({
    type,
    name,
    id,
    value,
    handleChange,
    backIcon,
    clientErrors = [],
    displayName = '',
    placeholder = '',
    required = false,
    disabled = false,
}: InputProps) {
    const backIconSize = 16;

    return (
        <div className={styles.inputWrapper}>
            <label className={presets.fontSizeBody} htmlFor={id}>
                {displayName}
            </label>
            <input
                type={type}
                name={name}
                id={id}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`${styles.inputField} ${presets.fontSizeBody} ${clientErrors.length > 0 ? styles.errorInput : ''}`}
            />

            {backIcon && (
                <Image
                    src={backIcon}
                    alt="Back icon"
                    width={backIconSize}
                    height={backIconSize}
                />
            )}

            {clientErrors.length > 0 && (
                <div className={styles.errorWrapper}>
                    <p className={presets.fontSizeBody}>Opps! Gotta fix: </p>
                    {clientErrors.map((error, index) => (
                        <p
                            className={`${presets.fontSizeCaption} ${styles.errorText}`}
                            key={index}
                        >
                            {error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

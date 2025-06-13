import presets from '@/styles/presets.module.css';
import styles from './Button.module.css';

export default function Button({
    children,
    handleClick,
    className = '',
    type = 'button',
    disabled = false,
}: {
    children: React.ReactNode;
    handleClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
}) {
    return (
        <button
            type={type}
            onClick={handleClick}
            className={`${styles.btn} ${styles[className]} ${
                presets.textPreset4Bold
            } ${presets.fontSizeBody}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

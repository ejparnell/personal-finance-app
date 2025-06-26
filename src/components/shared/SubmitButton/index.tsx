import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
    text: string;
    disabled?: boolean;
    isPending?: boolean;
}

export default function SubmitButton({
    text = 'Submit',
    disabled = false,
}: SubmitButtonProps) {
    return (
        <button type="submit" disabled={disabled} className={styles.submitBtn}>
            {disabled ? 'Submitting...' : text}
        </button>
    );
}

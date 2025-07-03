import styles from './DeleteButton.module.css';

interface DeleteButtonProps {
    children: React.ReactNode;
    handleClick: () => void;
}

export default function DeleteButton({
    children,
    handleClick,
}: DeleteButtonProps) {
    return (
        <button
            className={styles.deleteButton}
            type="button"
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

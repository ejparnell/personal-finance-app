import styles from './NewButton.module.css';

interface NewButtonProps {
    children: React.ReactNode;
    handleClick: () => void;
}

export default function NewButton({ children, handleClick }: NewButtonProps) {
    return (
        <button type="button" className={styles.newBtn} onClick={handleClick}>
            {children}
        </button>
    );
}

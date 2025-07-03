import styles from './EditButton.module.css';

interface EditButtonProps {
    children: React.ReactNode;
    handleClick?: () => void;
}

export default function EditButton({ children, handleClick }: EditButtonProps) {
    return (
        <button className={styles.editButton} onClick={handleClick}>
            {children}
        </button>
    )
}
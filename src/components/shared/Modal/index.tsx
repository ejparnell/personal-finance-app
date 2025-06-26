import Image from 'next/image';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    handleClose?: () => void;
    handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function Modal({
    isOpen,
    title,
    subtitle,
    children,
    handleClose,
    handleSubmit,
}: ModalProps) {
    const iconSize = 25;
    if (!isOpen) return null;

    return (
        <>
            <div className={styles.modalMask} />
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    <Image
                        src="/icons/icon-close-modal.svg"
                        alt="Close Modal"
                        width={iconSize}
                        height={iconSize}
                        onClick={handleClose}
                    />
                </div>

                <p className={styles.modalSubtitle}>{subtitle}</p>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {children}
                </form>
            </div>
        </>
    );
}

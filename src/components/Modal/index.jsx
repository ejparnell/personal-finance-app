import styles from './Modal.module.css'
import Image from 'next/image'

export default function Modal({ children, onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <Image src="/assets/images/icon-close-modal.svg" alt="Close" width={20} height={20} />
                </button>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    )
}

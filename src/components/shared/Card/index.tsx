import DotEditor from "../DotEditor";
import styles from "./Card.module.css";

interface CardProps {
    title?: string;
    color?: string;
    handleOpenEdit?: () => void;
    handleOpenDelete?: () => void;
    children?: React.ReactNode;
}

export default function Card({ title, color, handleOpenEdit, handleOpenDelete, children }: CardProps) {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitleContainer}>
                    {color && <div className={`${styles.cardIndicator} ${styles[color]}`} />}
                    <h2 className={styles.cardTitle}>{title}</h2>
                </div>
                <DotEditor
                    handleOpenEdit={handleOpenEdit}
                    handleOpenDelete={handleOpenDelete}
                    name={title || "Card"}
                    side="left"
                />
            </div>

            {children}
        </div>
    );
}
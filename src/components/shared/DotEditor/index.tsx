'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './DotEditor.module.css';

interface DotEditorProps {
    handleOpenEdit?: () => void;
    onDelete?: () => void;
    name: string;
    side: 'left' | 'right';
}

export default function DotEditor({
    handleOpenEdit,
    onDelete,
    name,
    side = 'left',
}: DotEditorProps) {
    const iconsSize = 16;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function toggleMenu() {
        setIsOpen((prev) => !prev);
    }

    function handleOpen(openFun: (() => void)) {
        toggleMenu();
        openFun();
    }

    return (
        <div className={styles.dotEditorContainer}>
            <div className={styles.dotEditorSelector}>
                <Image
                    src="/icons/icon-ellipsis.svg"
                    alt="Dot Editor"
                    width={iconsSize}
                    height={iconsSize}
                    onClick={toggleMenu}
                />
            </div>

            {isOpen && (
                <div className={`${styles.dotEditorMenu} ${side === 'left' ? styles.dotEditorLeft : styles.dotEditorRight}`}>
                    {handleOpenEdit && <p onClick={() => handleOpen(handleOpenEdit)} className={styles.dotEditorText}>Edit {name}</p>}
                    {onDelete && <p className={styles.dotEditorText} onClick={onDelete}>Delete {name}</p>}
                </div>
            )}
        </div>
    );
}

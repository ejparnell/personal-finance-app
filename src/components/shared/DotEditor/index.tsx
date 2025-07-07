'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './DotEditor.module.css';

interface DotEditorProps {
    handleOpenEdit?: () => void;
    handleOpenDelete?: () => void;
    name: string;
    side: 'left' | 'right';
}

export default function DotEditor({
    handleOpenEdit,
    handleOpenDelete,
    name,
    side = 'left',
}: DotEditorProps) {
    const iconsSize = 16;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function toggleMenu() {
        setIsOpen((prev) => !prev);
    }

    function handleOpen(openFun: () => void) {
        toggleMenu();
        openFun();
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(`.${styles.dotEditorContainer}`)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.dotEditorContainer}>
            <div>
                <Image
                    src="/icons/icon-ellipsis.svg"
                    alt="Dot Editor"
                    width={iconsSize}
                    height={iconsSize}
                    onClick={toggleMenu}
                />
            </div>

            {isOpen && (
                <div
                    className={`${styles.dotEditorMenu} ${side === 'left' ? styles.dotEditorLeft : styles.dotEditorRight}`}
                >
                    {handleOpenEdit && (
                        <p
                            onClick={() => handleOpen(handleOpenEdit)}
                            className={`${styles.dotEditorText} ${styles.dotEditorEdit}`}
                        >
                            Edit {name}
                        </p>
                    )}

                    {handleOpenDelete && (
                        <div className={styles.dotEditorDivider} />
                    )}

                    {handleOpenDelete && (
                        <p
                            className={`${styles.dotEditorDelete} ${styles.dotEditorText}`}
                            onClick={handleOpenDelete}
                        >
                            Delete {name}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

'use client';

import Image from 'next/image';
import styles from './NavIcon.module.css';

interface NavIconProps {
    iconPath: string;
    altText: string;
    active: boolean;
    isMenuOpen?: boolean;
    handleSelect: (altText: string) => void;
}

export default function NavIcon({
    iconPath,
    altText,
    isMenuOpen,
    active,
    handleSelect,
}: NavIconProps) {
    const iconSize = 24;

    return (
        <div
            onClick={() => handleSelect(altText)}
            className={`${styles.navIconWrapper} ${
                active ? styles.navIconWrapperActive : ''
            } ${
                isMenuOpen
                    ? styles.navIconWrapperOpen
                    : styles.navIconWrapperClosed
            }`}
        >
            <Image
                src={iconPath}
                alt={altText}
                height={iconSize}
                width={iconSize}
                className={active ? styles.navIconActiveImage : ''}
            />
            {isMenuOpen && (
                <p
                    className={`${styles.navIconText} ${
                        active ? styles.navIconTextActive : ''
                    }`}
                >
                    {altText}
                </p>
            )}
        </div>
    );
}

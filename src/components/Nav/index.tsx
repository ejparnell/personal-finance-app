'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NavIcon from './NavIcon';
import styles from './Nav.module.css';

const navItems = [
    {
        iconPath: '/icons/icon-nav-overview.svg',
        altText: 'Overview',
    },
    {
        iconPath: '/icons/icon-nav-budgets.svg',
        altText: 'Budgets',
    },
    {
        iconPath: '/icons/icon-nav-pots.svg',
        altText: 'Pots',
    },
    {
        iconPath: '/icons/icon-nav-recurring-bills.svg',
        altText: 'Recurring Bills',
    },
    {
        iconPath: '/icons/icon-nav-transactions.svg',
        altText: 'Transactions',
    },
];

type SelectedState =
    | 'Overview'
    | 'Budgets'
    | 'Pots'
    | 'Recurring Bills'
    | 'Transactions'
    | null;

export default function Nav() {
    const iconSize = 24;
    const router = useRouter();
    const [selected, setSelected] = useState<SelectedState>('Overview');
    // Setting initial Menu state to open to match the design.
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

    useEffect(
        () => {
            document.body.classList.toggle('nav-closed', !isMenuOpen);
        },
        [isMenuOpen]
    );

    function handleSelect(altText: string) {
        setSelected(altText as SelectedState);
        switch (altText) {
            case 'Overview':
                router.push('/overview');
                break;
            case 'Budgets':
                router.push('/budgets');
                break;
            case 'Pots':
                router.push('/pots');
                break;
            case 'Recurring Bills':
                router.push('/recurring-bills');
                break;
            case 'Transactions':
                router.push('/transactions');
                break;
            default:
                console.error('Unknown navigation item selected:', altText);
        }
    }

    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    return (
        <nav
            className={`${styles.navWrapper} ${
                isMenuOpen ? styles.navMenuOpen : styles.navMenuClosed
            }`}
        >
            <div className={styles.navHeader}>
                {isMenuOpen ? (
                    <Image
                        src="/icons/logo-large.svg"
                        alt="Finance Logo"
                        width={121}
                        height={21}
                        className={styles.navLogo}
                    />
                ) : (
                    <Image
                        src="/icons/logo-small.svg"
                        alt="Finance Logo"
                        width={iconSize}
                        height={iconSize}
                        className={styles.navLogo}
                    />
                )}
            </div>
            {navItems.map((icon, index) => (
                <NavIcon
                    key={index}
                    iconPath={icon.iconPath}
                    altText={icon.altText}
                    active={selected === icon.altText}
                    handleSelect={handleSelect}
                    isMenuOpen={isMenuOpen}
                />
            ))}

            <button className={styles.minimizeButton} onClick={toggleMenu}>
                <Image
                    src="/icons/icon-minimize-menu.svg"
                    alt="Minimize Menu Icon"
                    width={iconSize}
                    height={iconSize}
                    className={isMenuOpen ? '' : styles.navMinizeRotated}
                />
                {isMenuOpen && 'Minimize Menu'}
            </button>
        </nav>
    );
}

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import NavIcon from './NavIcon';
import styles from './Nav.module.css';

const navItems = [
    {
        iconPath: '/icons/icon-nav-overview.svg',
        altText: 'Overview',
        slug: 'overview',
    },
    {
        iconPath: '/icons/icon-nav-budgets.svg',
        altText: 'Budgets',
        slug: 'budgets',
    },
    { iconPath: '/icons/icon-nav-pots.svg', altText: 'Pots', slug: 'pots' },
    {
        iconPath: '/icons/icon-nav-recurring-bills.svg',
        altText: 'Recurring Bills',
        slug: 'recurring-bills',
    },
    {
        iconPath: '/icons/icon-nav-transactions.svg',
        altText: 'Transactions',
        slug: 'transactions',
    },
] as const;

export default function Nav() {
    const iconSize = 24;
    const router = useRouter();
    const pathname = usePathname();

    const slug = pathname.split('/')[1] || '';
    const activeTab =
        navItems.find((item) => item.slug === slug)?.altText ?? 'Overview';
    // Default menu state is set to open to match the design
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    useEffect(() => {
        document.body.classList.toggle('nav-closed', !isMenuOpen);
    }, [isMenuOpen]);

    function handleSelect(altText: string) {
        const item = navItems.find((item) => item.altText === altText);
        if (!item) return;
        router.push('/' + item.slug);
    }

    function toggleMenu() {
        setIsMenuOpen((prev) => !prev);
    }

    return (
        <nav
            className={`${styles.navWrapper} ${isMenuOpen ? styles.navMenuOpen : styles.navMenuClosed}`}
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

            {navItems.map((item) => (
                <NavIcon
                    key={item.altText}
                    iconPath={item.iconPath}
                    altText={item.altText}
                    active={activeTab === item.altText}
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

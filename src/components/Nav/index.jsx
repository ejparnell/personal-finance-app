'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import styles from './Nav.module.css'

export default function Nav() {
    const ICON_SIZE = 24
    const pathname = usePathname()

    return (
        <nav className={styles.nav}>
            <Link href='/' className={`${styles.nav__link} ${pathname === '/' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-overview.svg' alt='Overview' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
            <Link href='/transactions' className={`${styles.nav__link} ${pathname === '/transactions' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-transactions.svg' alt='Transactions' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
            <Link href='/budgets' className={`${styles.nav__link} ${pathname === '/budgets' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-budgets.svg' alt='Budgets' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
            <Link href='/pots' className={`${styles.nav__link} ${pathname === '/pots' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-pots.svg' alt='Pots' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
            <Link href='/recurring-bills' className={`${styles.nav__link} ${pathname === '/recurring-bills' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-recurring-bills.svg' alt='Recurring Bills' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
            <Link href='/account' className={`${styles.nav__link} ${pathname === '/account' ? styles['nav__link--active'] : ''}`}>
                <Image src='/assets/images/icon-nav-person.svg' alt='Account' width={ICON_SIZE} height={ICON_SIZE} />
                <div></div>
            </Link>
        </nav>
    )
}
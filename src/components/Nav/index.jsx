'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import useWindowSize from '@/hooks/useWindowSize'
import styles from './Nav.module.css'

const navItems =[
    { href: '/', icon: '/assets/images/icon-nav-overview.svg', text: 'Overview' },
    { href: '/transactions', icon: '/assets/images/icon-nav-transactions.svg', text: 'Transactions' },
    { href: '/budgets', icon: '/assets/images/icon-nav-budgets.svg', text: 'Budgets' },
    { href: '/pots', icon: '/assets/images/icon-nav-pots.svg', text: 'Pots' },
    { href: '/recurring-bills', icon: '/assets/images/icon-nav-recurring-bills.svg', text: 'Recurring Bills' },
    { href: '/account', icon: '/assets/images/icon-nav-person.svg', text: 'Account' }
]

export default function Nav() {
    const ICON_SIZE = 24
    const pathname = usePathname()
    const { width } = useWindowSize()

    return (
        <nav className={styles.nav}>
            {width >= 1024 && <Image priority className={styles.nav__logo} src='/assets/images/logo-large.svg' alt='Logo' width={121} height={22} />}

            {navItems.map(({ href, icon, text }) => (
                <Link key={href} href={href} className={`${styles.nav__link} ${pathname === href ? styles['nav__link--active'] : ''}`}>
                    <span className={styles.nav__indicator}></span>
                    <Image className={styles.nav__image} src={icon} alt={text} width={ICON_SIZE} height={ICON_SIZE} />
                    {width >= 768 && <p className={styles.nav__text}>{text}</p>}
                </Link>
            ))}
        </nav>
    )
}
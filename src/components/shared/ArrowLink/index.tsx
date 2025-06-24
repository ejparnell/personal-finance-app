import Link from 'next/link';
import Image from 'next/image';
import styles from './ArrowLink.module.css';

interface ArrowLinkProps {
    href: string;
    text: string;
}

export default function ArrowLink({ href, text }: ArrowLinkProps) {
    const iconSize = 12;

    return (
        <Link href={href} className={styles.arrowLink}>
            <div className={styles.arrowLinkContent}>
                <span>{text}</span>
                <Image
                    src="/icons/icon-caret-right.svg"
                    alt="Arrow Right"
                    width={iconSize}
                    height={iconSize}
                />
            </div>
        </Link>
    );
}

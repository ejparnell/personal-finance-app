import Image from 'next/image'

import styles from './Error.module.css'

export default function ErrorPage({ error }) {
    const ERROR_ICON_SIZE = 50
    return (
        <div className={styles.error__container}>
            <h1 className={styles.error__header}>
                <Image
                    src='/assets/images/icon-error.svg'
                    alt='Error'
                    width={ERROR_ICON_SIZE}
                    height={ERROR_ICON_SIZE}
                />
                Oh no! Something went wrong.
            </h1>
            <p className={styles.error__text}>{error.message}</p>
        </div>
    )
}
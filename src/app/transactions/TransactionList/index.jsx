import Image from 'next/image'

import useWindowSize from '@/hooks/useWindowSize'
import formatDate from '@/utils/formatDate'
import formatTransactionAmount from '@/utils/formatTransactionAmount'
import styles from './TransactionList.module.css'

export default function TransactionList({ transactions, handleTransactionDelete, handleTransactionEdit }) {
    const AVATAR_IMAGE_SIZE = 40
    const { width } = useWindowSize()

    return (
        <>
            {
                width < 768 &&
                transactions.map((tx, index) => (
                    <div key={tx._id || tx.date}>
                        <div className={styles.transaction__container}>
                            <div className={styles.transaction__details}>
                                <Image
                                    className={styles.transaction__avatar}
                                    src={tx.avatar ? `/${tx.avatar}` : '/assets/images/icon-nav-person.svg'}
                                    alt={tx.name}
                                    width={AVATAR_IMAGE_SIZE}
                                    height={AVATAR_IMAGE_SIZE}
                                />

                                <div className={styles.transaction__detail}>
                                    <p className={styles['transaction__text--primary']}>{tx.name}</p>
                                    <p className={styles['transaction__text--secondary']}>{tx.category}</p>
                                </div>
                            </div>
                            <div className={styles.transaction__detail}>
                                <p style={{ color: formatTransactionAmount(tx.amount).color }} className={`${styles['transaction__text--right']} ${styles['transaction__text--primary']}`}>{formatTransactionAmount(tx.amount).formattedValue}</p>
                                <p className={`${styles['transaction__text--right']} ${styles['transaction__text--secondary']}`}>{formatDate(tx.date)}</p>
                            </div>

                            {/* <div className={styles['transaction__actions']}>
                            <button onClick={() => handleTransactionDelete(tx._id)}>Delete</button>
                            <button onClick={() => handleTransactionEdit(tx)}>Edit</button>
                        </div> */}
                        </div>
                        {index < transactions.length - 1 && <hr className={styles.transaction__divider} />}
                    </div>
                ))
            }
            {
                width >= 768 &&
                <table className={styles.transaction__table}>
                    <thead>
                        <tr className={styles['transaction__text--secondary']}>
                            <th className={styles.transaction__row}>Recipient/Sender</th>
                            <th className={styles.transaction__row}>Category</th>
                            <th className={styles.transaction__row}>Transaction Date</th>
                            <th className={styles.transaction__row}>Amount</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className={styles['transaction__text--primary']}>
                        {transactions.map(tx => (
                            <tr key={tx._id || tx.date}>
                                <td className={styles.transaction__row}>
                                    <Image
                                        className={styles.transaction__avatar}
                                        src={tx.avatar ? `/${tx.avatar}` : '/assets/images/icon-nav-person.svg'}
                                        alt={tx.name}
                                        width={AVATAR_IMAGE_SIZE}
                                        height={AVATAR_IMAGE_SIZE}
                                    />
                                    {tx.name}
                                </td>
                                <td className={`${styles.transaction__row} ${styles['transaction__text--secondary']}`}>{tx.category}</td>
                                <td className={`${styles.transaction__row} ${styles['transaction__text--secondary']}`}>{formatDate(tx.date)}</td>
                                <td className={styles.transaction__row} style={{ color: formatTransactionAmount(tx.amount).color }}>{formatTransactionAmount(tx.amount).formattedValue}</td>
                                {/* <td>
                                <button onClick={() => handleTransactionDelete(tx._id)}>Delete</button>
                                <button onClick={() => handleTransactionEdit(tx)}>Edit</button>
                            </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    )
}

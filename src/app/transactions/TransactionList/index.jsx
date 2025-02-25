import Image from 'next/image'

export default function TransactionList({ transactions }) {
    return (
        <ul>
            {transactions.map(tx => (
                <li key={tx._id || tx.date}>
                    {tx.avatar && <Image
                        src={`/${tx.avatar}`}
                        alt={tx.name}
                        width={20}
                        height={20}
                    />}
                    <p>{tx.name}</p>
                    <p>{tx.category}</p>
                    <p>{tx.date}</p>
                    <p>{tx.amount}</p>
                </li>
            ))}
        </ul>
    )
}

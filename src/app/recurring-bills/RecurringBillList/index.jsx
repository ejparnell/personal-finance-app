import Image from 'next/image'

export default function RecurringBillList({ recurringBills, openRecurringBillUpdate }) {
    return (
        <ul>
            {recurringBills.map(bill => (
                <li key={bill._id || bill.date}>
                    {bill.avatar && (
                        <Image
                            src={`/${bill.avatar}`}
                            alt={bill.name}
                            width={20}
                            height={20}
                        />
                    )}
                    <p>{bill.name}</p>
                    <p>{bill.date}</p>
                    <p>{Math.abs(bill.amount)}</p>
                    <button>Delete</button>
                    <button onClick={() => openRecurringBillUpdate(bill)}>Edit</button>
                </li>
            ))}
        </ul>
    )
}
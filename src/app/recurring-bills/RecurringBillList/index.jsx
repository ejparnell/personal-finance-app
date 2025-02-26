import Image from 'next/image'

export default function RecurringBillList({ recurringBills, handleRecurringBillDelete, onRecurringBillUpdate }) {
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
                    <p>{bill.amount}</p>
                    <button onClick={() => handleRecurringBillDelete(bill._id)}>Delete</button>
                    <button onClick={() => onRecurringBillUpdate(bill)}>Edit</button>
                </li>
            ))}
        </ul>
    )
}
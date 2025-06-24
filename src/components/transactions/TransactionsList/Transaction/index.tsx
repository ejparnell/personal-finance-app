import Image from 'next/image';

interface TransactionProps {
    avatar: string;
    name: string;
    amount: number;
    date: string;
}

export default function Transaction({
    avatar,
    name,
    amount,
    date,
}: TransactionProps) {
    const avatarSize = 32;

    return (
        <div>
            <Image
                src={avatar}
                alt={`${name}'s avatar`}
                width={avatarSize}
                height={avatarSize}
            />

            <p>{name}</p>

            <div>
                <p>${amount}</p>
                <p>{date}</p>
            </div>
        </div>
    );
}

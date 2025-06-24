'use client';

import { useMessage } from '@/context/MessageProvider';

import Message from './Message';
import styles from './MessageList.module.css';

export default function MessageList() {
    const { messages, handleRemoveMessage } = useMessage();

    return (
        <div className={styles.messageWrapper}>
            {messages.map((message) => (
                <Message
                    key={message.id}
                    content={message.content}
                    type={message.type}
                    handleClose={() => handleRemoveMessage(message.id)}
                />
            ))}
        </div>
    );
}

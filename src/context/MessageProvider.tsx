import {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from 'react';

interface MessageTypes {
    success: 'success';
    error: 'error';
    info: 'info';
    warning: 'warning';
}

interface Message {
    id: string;
    content: string;
    type: keyof MessageTypes;
    created: Date;
}

interface MessageContextType {
    messages: Message[];
    handleSetMessages: (content: string, type?: keyof MessageTypes) => void;
    handleRemoveMessage: (id: string) => void;
}

const MessageContext = createContext<MessageContextType>({
    messages: [],
    handleSetMessages: () => {},
    handleRemoveMessage: () => {},
});

export function MessageProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        messages.forEach((message) => {
            const timeout = setTimeout(() => {
                handleRemoveMessage(message.id);
            }, 5000);

            return () => clearTimeout(timeout);
        });
    }, [messages]);

    function handleSetMessages(
        content: string,
        type: keyof MessageTypes = 'info'
    ) {
        const newMessage: Message = {
            id: crypto.randomUUID(),
            content: content,
            type: type,
            created: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    function handleRemoveMessage(id: string) {
        setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== id)
        );
    }

    return (
        <MessageContext.Provider
            value={{ messages, handleSetMessages, handleRemoveMessage }}
        >
            {children}
        </MessageContext.Provider>
    );
}

export function useMessage() {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
}

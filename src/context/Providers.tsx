'use client';

import { MessageProvider } from './MessageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <MessageProvider>{children}</MessageProvider>;
}

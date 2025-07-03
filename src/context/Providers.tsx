'use client';

import { MessageProvider } from './MessageProvider';
import { PotProvider } from './PotProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MessageProvider>
            <PotProvider>{children}</PotProvider>
        </MessageProvider>
    );
}

import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import Providers from '@/context/Providers';
import MessageList from '@/components/MessageList';
import Nav from '@/components/Nav';
import '@/styles/globals.css';

const publicSans = Public_Sans({
    variable: '--font-public-sans',
    subsets: ['latin'],
    weight: ['400', '700'],
    preload: true,
});

export const metadata: Metadata = {
    title: 'Frontend Mentor | Personal Finance App',
    keywords: ['Frontend Mentor', 'Next.js', 'React', 'Web Development'],
    authors: [{ name: 'Elizabeth Parnell' }],
    creator: 'Elizabeth Parnell',
    icons: {
        icon: '/favicon-32x32.png',
        apple: '/favicon-32x32.png',
        shortcut: '/favicon-32x32.png',
    },
    description: 'A project build by Elizabeth Parnell for Frontend Mentor.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Providers>
                <body className={publicSans.variable}>
                    <MessageList />
                    <Nav />
                    <main className="main">{children}</main>
                </body>
            </Providers>
        </html>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
    }
    interface Session {
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
    }
}

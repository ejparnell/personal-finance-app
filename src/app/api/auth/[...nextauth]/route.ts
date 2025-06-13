import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { loginSchema } from '@/schemas/user';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(creds) {
                const { email, password } = loginSchema.parse(creds);
                await dbConnect();

                const user = await User.findOne({ email }).select('+password');
                if (!user) return null;

                const match = await bcrypt.compare(
                    password,
                    user.password as string
                );
                if (!match) return null;

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            if (token?.id)
                session.user = { ...session.user, id: token.id as string };
            return session;
        },
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

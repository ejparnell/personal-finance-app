import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                await connectToDatabase()

                if (!credentials) return null

                const user = await User.findOne({ email: credentials.email })
                if (!user) return null

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                return { id: user._id.toString(), email: user.email }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

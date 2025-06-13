import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: { signIn: '/login' },
    callbacks: {
        authorized({ token, req }) {
            console.log('Middleware token:', token);
            const { pathname } = req.nextUrl;

            if (
                pathname.startsWith('/login') ||
                pathname.startsWith('/register')
            ) {
                return true;
            }

            return !!token;
        },
    },
});

export const config = {
    /**
     * Protect *every* page except:
     *  - Next.js internals (_next, images, favicon)
     *  - API routes
     *  - the public auth pages handled above
     */
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|login|register).*)',
    ],
};

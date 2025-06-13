'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encode } from 'next-auth/jwt';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { registerSchema } from '@/schemas/user';

export type RegisterState = {
    error?: string | null;
    success?: boolean;
};

export async function registerAndLogin(
    _prev: RegisterState,
    formData: FormData
): Promise<RegisterState | never> {
    const raw = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.message, success: false };
    }

    await dbConnect();
    const existingUser = await User.findOne({ email: parsed.data.email });
    if (existingUser) {
        return { error: 'User already exists', success: false };
    }
    const user = await User.create(parsed.data);
    if (!user) {
        return { error: 'Failed to create user', success: false };
    }
    const token = await encode({
        token: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: 60 * 60 * 24, // 1 day
    });

    const name =
        process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token';

    const cookieStore = await cookies();

    cookieStore.set({
        name,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
    });

    redirect('/profile');
    return { success: true };
}

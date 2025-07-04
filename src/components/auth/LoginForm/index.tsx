'use client';

import { useState, FormEvent, useTransition, ChangeEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginInput } from '@/schemas/user';
import { useMessage } from '@/context/MessageProvider';
import { FormErrors } from '@/types/validators';
import { getClientErrors, getErrorMessage } from '@/lib/utils';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import presets from '@/styles/presets.module.css';
import styles from './LoginForm.module.css';

type LoginFormClientErrors = FormErrors<LoginInput>;

const loginFormItems = [
    {
        type: 'email',
        name: 'email',
        id: 'email',
        displayName: 'Email',
        placeholder: 'Enter your email',
        required: true,
        disabled: false,
    },
    {
        type: 'password',
        name: 'password',
        id: 'password',
        displayName: 'Password',
        placeholder: 'Enter your password',
        required: true,
        disabled: false,
    },
];
const defaultState: LoginInput = {
    email: '',
    password: '',
};
const defaultClientErrors: LoginFormClientErrors = {
    email: [],
    password: [],
};

export default function LoginForm() {
    const router = useRouter();
    const [form, setForm] = useState<LoginInput>(defaultState);
    const [clientErrors, setClientErrors] =
        useState<LoginFormClientErrors>(defaultClientErrors);
    const [isPending, startTransition] = useTransition();
    const { handleSetMessages } = useMessage();

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm((prev: LoginInput) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
            const formattedErrors = getClientErrors(
                parsed.error.flatten().fieldErrors,
                defaultClientErrors
            );

            setClientErrors(formattedErrors as LoginFormClientErrors);

            return;
        }
        setClientErrors(defaultClientErrors);

        startTransition(async () => {
            const res = await signIn('credentials', {
                ...form,
                redirect: false,
            });

            if (res?.error) {
                const errorMessage = getErrorMessage(res.error);
                handleSetMessages(errorMessage, 'error');
                setForm(defaultState);
            } else {
                handleSetMessages('Login successful!', 'success');
                router.replace('/overview');
            }
        });
    }

    return (
        <form
            className={`${presets.boxShadowCenter} ${styles.loginForm}`}
            onSubmit={handleSubmit}
        >
            <h1 className={presets.textPreset1}>Login</h1>

            {loginFormItems.map((item) => (
                <Input
                    key={item.id}
                    type={item.type}
                    name={item.name}
                    id={item.id}
                    value={form[item.name as keyof LoginInput]}
                    handleChange={handleChange}
                    displayName={item.displayName}
                    placeholder={item.placeholder}
                    required={item.required}
                    disabled={item.disabled}
                    clientErrors={
                        clientErrors[
                            item.name as keyof LoginFormClientErrors
                        ] || []
                    }
                />
            ))}

            <Button
                className="submit"
                type="submit"
                disabled={
                    isPending ||
                    Object.values(clientErrors).some(
                        (errors) => errors.length > 0
                    )
                }
            >
                {isPending ? 'Logging in...' : 'Login'}
            </Button>

            <div className={styles.registerLink}>
                <p className={presets.textPreset4}>
                    Need to create an account?{' '}
                    <Link
                        href="/register"
                        className={`${presets.textPreset4Bold} ${styles.registerLinkText}`}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </form>
    );
}

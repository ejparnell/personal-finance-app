'use client';

import {
    useActionState,
    ChangeEvent,
    FormEvent,
    useState,
    useTransition,
} from 'react';
import { registerAndLogin, type RegisterState } from '@/actions/auth';
import { registerSchema, RegisterInput } from '@/schemas/user';
import { FormErrors } from '@/types/validators';
import { getClientErrors, getErrorMessage } from '@/lib/utils';
import { useMessage } from '@/context/MessageProvider';
import Input from '@/components/shared/Input';
import presets from '@/styles/presets.module.css';
import styles from './RegisterForm.module.css';

type RegisterFormClientErrors = FormErrors<RegisterInput>;

const registerFormItems = [
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
    {
        type: 'password',
        name: 'confirmPassword',
        id: 'confirmPassword',
        displayName: 'Confirm Password',
        placeholder: 'Re-enter your password',
        required: true,
        disabled: false,
    },
];
const defaultState: RegisterInput = {
    email: '',
    password: '',
    confirmPassword: '',
};
const defaultClientErrors: RegisterFormClientErrors = {
    email: [],
    password: [],
    confirmPassword: [],
};

export default function RegisterForm() {
    const [form, setForm] = useState<RegisterInput>(defaultState);
    const [clientErrors, setClientErrors] =
        useState<RegisterFormClientErrors>(defaultClientErrors);
    const [serverState, submitAction] = useActionState<RegisterState, FormData>(
        registerAndLogin,
        {}
    );
    const [isPending, startTransition] = useTransition();
    const { handleSetMessages } = useMessage();

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsed = registerSchema.safeParse(form);
        if (!parsed.success) {
            const formattedErrors = getClientErrors(
                parsed.error.flatten().fieldErrors,
                defaultClientErrors
            );

            setClientErrors(formattedErrors as RegisterFormClientErrors);
            return;
        }
        setClientErrors(defaultClientErrors);

        const formData = new FormData();
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('confirmPassword', form.confirmPassword);

        startTransition(() => {
            submitAction(formData);

            if (serverState?.error) {
                const errorMessage = getErrorMessage(serverState.error);
                handleSetMessages(errorMessage, 'error');
                setForm(defaultState);
            } else {
                handleSetMessages('Registration successful!', 'success');
            }
        });
    }

    return (
        <form
            className={`${presets.boxShadowCenter} ${styles.registerForm}`}
            onSubmit={handleSubmit}
        >
            <h2 className={presets.fontSizeHeading}>Create an account</h2>

            {registerFormItems.map((item) => (
                <Input
                    key={item.id}
                    type={item.type}
                    name={item.name}
                    id={item.id}
                    value={form[item.name as keyof RegisterInput]}
                    handleChange={handleChange}
                    displayName={item.displayName}
                    placeholder={item.placeholder}
                    required={item.required}
                    disabled={isPending}
                    clientErrors={
                        clientErrors[
                            item.name as keyof RegisterFormClientErrors
                        ] || []
                    }
                />
            ))}

            <button
                className={presets.submitBtn}
                type="submit"
                disabled={isPending}
            >
                {isPending ? 'Creating…' : 'Create account'}
            </button>
        </form>
    );
}

import { Metadata } from 'next';
import AuthBanner from '@/components/auth/AuthBanner';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from './RegisterPage.module.css';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create a new account',
};

export default function RegisterPage() {
    return (
        <div className={styles.registerPage}>
            <AuthBanner />

            <div className={styles.registerFormContainer}>
                <RegisterForm />
            </div>
        </div>
    );
}

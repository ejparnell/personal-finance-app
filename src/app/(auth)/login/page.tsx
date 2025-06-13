import { Metadata } from 'next';
import AuthBanner from '@/components/auth/AuthBanner';
import LoginForm from '@/components/auth/LoginForm';
import styles from './LoginPage.module.css';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
};

export default function LoginPage() {
    return (
        <main className={styles.loginPage}>
            <AuthBanner />

            <div className={styles.loginFormContainer}>
                <LoginForm />
            </div>
        </main>
    );
}

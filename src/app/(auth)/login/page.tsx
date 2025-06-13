import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import styles from './LoginPage.module.css';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
};

export default function LoginPage() {
    return (
        <main className={styles.loginPage}>
            <LoginForm />
        </main>
    );
}

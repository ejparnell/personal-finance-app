import Image from 'next/image';
import logoSmall from '@/assets/logo-large.svg';
import presets from '@/styles/presets.module.css';
import styles from './AuthBanner.module.css';

export default function AuthBanner() {
    return (
        <div>
            {/* Small screen view */}
            <div className={styles.authBannerSm}>
                <Image
                    src={logoSmall}
                    alt="Finance Logo"
                    width={121}
                    height={22}
                />
            </div>

            {/* Large screen view */}
            <div className={styles.authBannerLg}>
                <Image
                    src={logoSmall}
                    alt="Finance Logo"
                    width={121}
                    height={22}
                    className={styles.logoSmall}
                />
                <div className={styles.bannerText}>
                    <h2 className={presets.textPreset1}>
                        Keep track of your money and save for your future
                    </h2>
                    <p className={presets.textPreset4}>
                        Personal finance app puts you in control of your
                        spending. Track transactions, set budgets, and add to
                        savings pots easily.
                    </p>
                </div>
            </div>
        </div>
    );
}

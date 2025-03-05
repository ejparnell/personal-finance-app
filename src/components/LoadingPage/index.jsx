'use client'

import { HashLoader } from 'react-spinners'

import styles from './Loading.module.css'

export default function Loading({ loading }) {

    return (
        <div className={styles.loading__container}>
            <HashLoader
                color='#277C78'
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}
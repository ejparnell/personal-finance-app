'use client'

import Image from 'next/image'

import useWindowSize from '@/hooks/useWindowSize'
import styles from './Pagination.module.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const { width } = useWindowSize()

    const renderPageNumbers = () => {
        if (width < 768 && totalPages > 4) {
            let pagesToShow

            if (currentPage <= 2) {
                pagesToShow = [1, 2, 'ellipsis', totalPages]
            } else if (currentPage >= totalPages - 1) {
                pagesToShow = [1, 'ellipsis', totalPages - 1, totalPages]
            } else {
                pagesToShow = [currentPage - 1, currentPage, 'ellipsis', totalPages]
            }

            return pagesToShow.map((item, index) => {
                if (item === 'ellipsis') {
                    return (
                        <div key={index} className={styles.pagination__number}>
                            ...
                        </div>
                    )
                }

                return (
                    <div
                        key={index}
                        onClick={() => onPageChange(item)}
                        style={{
                            backgroundColor: currentPage === item ? '#201F24' : undefined,
                            color: currentPage === item ? '#FFFFFF' : undefined
                        }}
                        className={styles.pagination__number}
                    >
                        {item}
                    </div>
                )
            })
        } else {

            return Array.from({ length: totalPages }, (_, i) => (
                <div
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    style={{
                        backgroundColor: currentPage === i + 1 ? '#201F24' : undefined,
                        color: currentPage === i + 1 ? '#FFFFFF' : undefined
                    }}
                    className={styles.pagination__number}
                >
                    {i + 1}
                </div>
            ))
        }
    }

    return (
        <div className={styles.pagination__container}>
            <button
                className={styles.pagination__btn}
                onClick={() => onPageChange('prev')}
                disabled={currentPage === 1}
            >
                <Image src='/assets/images/icon-caret-left.svg' alt='Previous' width={10} height={10} />
                {width >= 768 && <span className={styles['pagination__btn--prev']}>Prev</span>}
            </button>
            <div className={styles.pagination__numbers}>
                {renderPageNumbers()}
            </div>
            <button
                className={styles.pagination__btn}
                onClick={() => onPageChange('next')}
                disabled={currentPage === totalPages}
            >
                {width >= 768 && <span className={styles['pagination__btn--next']}>Next</span>}
                <Image src='/assets/images/icon-caret-right.svg' alt='Next' width={10} height={10} />
            </button>
        </div>
    )
}

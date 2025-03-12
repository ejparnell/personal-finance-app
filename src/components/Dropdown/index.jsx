'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

import useWindowSize from '@/hooks/useWindowSize'
import styles from './Dropdown.module.css'

export default function Dropdown({ options, onSelect, image, alt, label }) {
    const { width } = useWindowSize()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleOptionClick(option) {
        setSelected(option.value)
        onSelect(option.value)
        setOpen(false)
    }

    return (
        <div className={styles['drop-down__container']} ref={dropdownRef}>
            {
                width < 768 ?
                    <div onClick={() => setOpen(!open)}>
                        <Image src={image} alt={alt} width={20} height={20} />
                    </div> :
                    <div className={styles['drop-down__label__container']} onClick={() => setOpen(!open)}>
                        <p className={styles['drop-down__label']}>{label}</p>
                        <div className={styles['drop-down__menu']}>
                            <p>{selected || options[0].label}</p>
                            <Image
                                src='/assets/images/icon-caret-down.svg'
                                alt='Caret down'
                                width={10}
                                height={10}
                            />
                        </div>
                    </div>
            }

            {open && (
                <div className={styles['drop-down__list']}>
                    {options.map((option, index) => (
                        <div className={`${styles['drop-down__option']} ${selected === option.value ? styles['drop-down__option--selected'] : undefined}`} key={option.value} onClick={() => handleOptionClick(option)}>
                            {option.label}
                            {index < options.length - 1 && <hr className={styles['drop-down__divider']} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

import React from 'react'
import Image from 'next/image'
import calendarIcon from '../../public/calendar.svg'
import styles from './Logo.module.scss'
import Link from 'next/link'

const Logo = () => {
    return (
        <div className={styles.logo}>
            <Link href='/'>
                <a>
                    <Image
                        src={calendarIcon}
                        width={50}
                        height={50}
                        alt={'By Font Awesome - Own work, OFL, https://commons.wikimedia.org/w/index.php?curid=37001111'}
                    />
                    <span className={styles['logo__text']}>Calendar</span>
                </a>
                
            </Link>
        </div>
    )
}

export default Logo

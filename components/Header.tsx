import React from 'react'
import Image from 'next/image'
import calendarIcon from '../public/calendar.svg'
import styles from './Header.module.scss'

const Header = ({month, setMonth, handleInputChange}) => {
  const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
      <header className={styles.header}>
      Calendar
      <Image
        src={calendarIcon}
        width={50}
        height={50}
      />
      <nav>
        <form>
          <label>
            <select name='month' onChange={handleInputChange}>
              <option value={month}>{months[month]}</option>
              {
                months
                .filter((m ,i)=> i !== month)
                .map(month => <option 
                    value={months.findIndex(element => element === month)} 
                    key={month}>{month}
                  </option>)
              }
            </select>
          </label>
        </form>
      </nav>
    </header>
  )
}

export default Header

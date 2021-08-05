import React from 'react'
import styles from './Header.module.scss'
import Logo from '../Logo/Logo'

interface Props {
  month: number;
  setMonth: any;
  handleDateChange: any;
  year: number;
  months: string[];
}

const Header = (props: Props) => {
  const {month, setMonth, handleDateChange, year, months} = props

  const years: number[] = []
  for(let i=0; i<10; i++) years.push(2021 - i)

  return (
    <header className={styles.header}>
      <Logo/>
      <nav>
        <form className={styles['header__form']}>
          <label className={styles['header__label']}>
            Select month:
            <select name='month' onChange={handleDateChange} className={styles['header__input']}>
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
          <label className={styles['header__label']}>
            Select year:
            <select name='year' onChange={handleDateChange} className={styles['header__input']}>
              <option value={year}>{year}</option>
              {
                years
                .filter(y => y !== year)
                .map(year => <option 
                    value={year} 
                    key={year}>{year}
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

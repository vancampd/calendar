import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Header from '../components/Header/Header'
import {useState} from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth())

  const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const handleDateChange = (e): void => {
    const {name, value} = e.target   
    
        if(name === 'month') setMonth(parseInt(value))
        if(name === 'year') setYear(parseInt(value))
  }

  return (
    <>
      <Header
        month={month}
        setMonth={setMonth}
        handleDateChange={handleDateChange}
        year={year}
        months={months}
      />
      <Component 
      {...pageProps} 
        month={month}
        setMonth={setMonth}
        handleDateChange={handleDateChange}
        year={year}
        setYear={setYear}
        months={months}
      />
    </>
  )
}
export default MyApp

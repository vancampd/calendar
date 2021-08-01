import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Header from '../components/Header/Header'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [dayOfMonth, setDayOfMonth] = useState<number | undefined>()
  const router = useRouter()

  const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const handleDateChange = (e): void => {
    const {name, value} = e.target   
        if(name === 'month') setMonth(parseInt(value))
        if(name === 'year') setYear(parseInt(value))
        setDayOfMonth()
  }

  useEffect(()=> {
    if(dayOfMonth && month && year){
      router.push(`/single-day/${month+1}-${dayOfMonth}-${year}`) 
    }
    else router.push(`/`)
  },[month, dayOfMonth, year])

  const months31: number[] = [0,2,4,6,7,9,11]
  const months30: number[] = [3,5,8,10]

  const [numberOfDays, setNumberOfDays] = useState<number | undefined>()

  // Set the amount of days in the month to 31, 30, or 28 based on which month is selected in the <select> menu in the header
  useEffect(()=>{
    if(months31.includes(month)) {
      setNumberOfDays(31)
    }
    else if (months30.includes(month)){
      setNumberOfDays(30)
    }
    else setNumberOfDays(28)
  },[month] )

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
        dayOfMonth={dayOfMonth}
        setDayOfMonth={setDayOfMonth}
        numberOfDays={numberOfDays}
      />
    </>
  )
}
export default MyApp

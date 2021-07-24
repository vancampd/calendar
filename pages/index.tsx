import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {server} from '../config/index'
import axios from 'axios'

export default function Home({year, setYear, month, setMonth, handleDateChange, months, events, dayOfMonth, setDayOfMonth}) {
  console.log('events', events)

  const daysOfTheWeek: string[] = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday'
  ]

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

  // Create array of dates to map through based on how many days are in the selected month
  const daysArray: (number | string)[] = []
  if(typeof numberOfDays !== 'undefined'){
    for(let i = 1; i <= numberOfDays; i++) daysArray.push(i)
  } 

  // Find which day the 1st of the month is
  let firstDayOfMonth: number | undefined;
  if(month || month === 0){
    if(year) {
      firstDayOfMonth = new Date(year, month, 1).getDay()
      // Add empty days/strings to the beginning of daysArray so the dates are on the correct day
      for(let i = 0; i<firstDayOfMonth; i++) daysArray.unshift('')
    }
  }
  
  return (
    <div className={styles['home-page']}>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar app to track daily schedule and todos" />
        <link rel="icon" href="/calendar.svg" alt='By Font Awesome - Own work, OFL, https://commons.wikimedia.org/w/index.php?curid=37001111'/>
      </Head>
      <main className={styles['calendar-container']}>
        <section className={styles.calendar}>
          <div className={styles['calendar__labels-section']}>
            {
              daysOfTheWeek.map(day => <div key={day} className={styles['calendar__labels']}>{day}</div>)
            }
          </div>
          <section className={styles['calendar__days-section']}>
            {
              daysArray.map((day,i) => 
              <Link href={`/single-day/${month+1}-${day}-${year}`} key={i} >
                  <div 
                    className={day ? styles['calendar__day'] : styles['calendar__day--no-border']} 
                    onClick={()=> setDayOfMonth(day)}
                  >
                    {day}
                    {
                      events.filter(event => event.day === day).map(event => <p>{event.description}</p>)
                    }
                </div>
              </Link>)
            }
          </section>
        </section>
      </main>

        
    </div>
  )
}

export const getServerSideProps = async (context) => {
  
  const res = await axios.get(`${server}/api/indexRoutes`)

  return {
      props: {
          events: res.data
      }
  }
}
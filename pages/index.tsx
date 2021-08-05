import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {server} from '../config/index'
import axios from 'axios'

interface Props {
  month:number;
  year:number;
  months:string[];
  dayOfMonth:number;
  setDayOfMonth:any;
  numberOfDays:any;
  events: any;
}

export default function Home(props: Props) {
  const {year, month, months, events, dayOfMonth, setDayOfMonth, numberOfDays} = props

  const [windowSize, setWindowSize] = useState<number>()

  useEffect(()=> {setWindowSize(window.innerWidth)}, [])

  const handleWindowResize = (e: any) => setWindowSize(e.target.innerWidth)
  const [eventAdded, setEventAdded] = useState(false)

  useEffect(()=>{
    window.addEventListener('resize', handleWindowResize)
    return ()=>{window.removeEventListener('resize', handleWindowResize)}
  })

  const daysOfTheWeek: string[] = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday'
  ]

  const [backgroundImage, setBackgroundImage] = useState('')
  const [backgroundStyles, setBackgroundStyles] = useState({
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover'
  })

  useEffect(()=>{
    setBackgroundImage(`https://placeimg.com/640/480/nature/${Math.floor(Math.random()*120)}`)
  }, [month, year])

  useEffect(()=>setBackgroundStyles({
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover'
  }), [backgroundImage])

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
    <div className={styles['home-page']} style={backgroundStyles}>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar app to track daily schedule and todos" />
        <link rel="iBy Font Awesome - Own work, OFL, https://commons.wikimedia.org/w/index.php?curid=37001111'" href="/calendar.svg"/>
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
                    className={day && day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? styles['calendar__day--current'] : day ? styles['calendar__day'] : styles['calendar__day--no-border']} 
                    onClick={()=> setDayOfMonth(day)}
                  >
                    {day}
                    <div className={styles['calendar__event-container']}>
                      {
                        events.filter((event:any) => event.day === day && event.month === month && event.year === year).sort((a:any,b:any)=>{
                          const typeA = a.type 
                          const typeB = b.type
                          if(typeA === 'event'){
                            return -1
                          }
                          else return 1
                        }).map((event:any) => <p key={event.id}
                        className={event.type === 'event' ? styles['calendar__event'] : styles['calendar__event--task']}
                        >
                          {
                            windowSize && windowSize < 600 ?
                            '●'
                            : event.description 
                          }
                          
                        </p>)
                      }
                    </div>
                </div>
              </Link>)
            }
          </section>
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps = async (context:any) => {
  
  const res = await axios.get(`${server}api/indexRoutes`)

  return {
      props: {
          events: res.data
      }
  }
}
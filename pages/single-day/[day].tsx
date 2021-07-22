import React, {useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import styles from '../../styles/SingleDay.module.scss'
import axios from 'axios'
import {server} from '../../config/index'


const singleDay = ({year, setYear, month, setMonth, handleDateChange, months, events}) => {
    console.log(events)
    const router = useRouter()
    const {day} = router.query

    let dayArray: string[] = [];

    if(day) dayArray = day.toString().split('-')

    const [input, setInput] = useState({
        description: '',
        type: ''
    })

    const [error, setError] = useState(false)

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setInput({
            ...input,
            [name]: value.toString()
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        console.log('input being submitted', input)

        if(!input.description || !input.type) return setError(true)

        axios
            .post(`${server}/api/events/${day}`, {
                ...input,
                day: parseInt(dayArray[1]),
                month,
                year
            })
            .then(res => console.log(res))

        setInput({
            description: '',
            type: ''
        })

        setError(false)

    }

    return (
        <div className={styles['single-day']}>
            <Head>
                <title>Calendar: {day} </title>
                <meta name="description" content="Calendar app to track daily schedule and todos" />
                <meta name="description" content="Your schedule and tasks for a single day" />
                <link rel="icon" href="/calendar.svg" alt='By Font Awesome - Own work, OFL, https://commons.wikimedia.org/w/index.php?curid=37001111'/>
            </Head>
            <h1>{months[month]} {dayArray[1]}</h1>
            <form onSubmit={handleFormSubmit}>
                <label>
                    <input 
                        type='text'
                        name='description'
                        value={input.description}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Event
                    <input 
                        type='radio'
                        name='type'
                        value='event'
                        checked={input.type === 'event' ? true : false}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Task
                    <input 
                        type='radio'
                        name='type'
                        value='task'
                        checked={input.type === 'task' ? true : false}
                        onChange={handleInputChange}
                    />
                </label>
                <button>
                    Add
                </button>
                {
                    error ?
                    <p>Please fill out the entire form</p>
                    : ''
                }
            </form>
            <section>
                <h2>Events</h2>
                {
                    events
                        .filter(event => event.type === 'event')
                        .map(event => <p key={event.id}>{event.description}</p>)
                }
                <h2>Tasks</h2>
                {
                    events
                        .filter(event => event.type === 'task')
                        .map(event => <p key={event.id}>{event.description}</p>)
                }
            </section>
        </div>
    )
}

export default singleDay;

export const getServerSideProps = async (context) => {
    const {day} = context.params
    let events;
    
    const res = await axios.get(`${server}/api/events/${day}`)

    return {
        props: {
            events: res.data
        }
    }
}
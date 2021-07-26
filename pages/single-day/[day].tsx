import React, {useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import styles from '../../styles/SingleDay.module.scss'
import axios from 'axios'
import {server} from '../../config/index'
import DeleteItem from '../../components/DeleteItem/DeleteItem'


const singleDay = ({year, setYear, month, setMonth, handleDateChange, months, events, checkedItems}) => {
    console.log('checkedItems',checkedItems)
    const router = useRouter()
    const {day} = router.query

    let dayArray: string[] = [];

    if(day) dayArray = day.toString().split('-')

    const [input, setInput] = useState({
        description: '',
        type: '',
        time: '',
        timeOfDay:''
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
            .then(res => {
                console.log(res.config.data)
            })

        setInput({
            description: '',
            type: '',
            time: '',
            timeOfDay: ''
        })
        setError(false)
    }

    const hours = [1,2,3,4,5,6,7,8,9,10,11,12]

    const [showDelete, setShowDelete] = useState<boolean>(false)
    const [id, setId] = useState<number | undefined>()

    const handleDelete = (e, id) => {
        e.preventDefault()

        axios
            .delete(`${server}/api/events/${day}`, {
                data: {
                    id
                }
            })
            .then(res => {
                console.log(res)
                setShowDelete(false)
                events = axios.get(`${server}/api/events/${day}`)
            })
    }

    const [checkedTasks, setCheckedTasks] = useState<number[]>(checkedItems.map(item=>item.item_id))

    const handleCheckedTasks = (e) => {
        const {checked, value} = e.target
        console.log('checked',checked)
        if(checked){
            setCheckedTasks([parseInt(value), ...checkedTasks])
        }
        else{
            const newCheckedTasks = checkedTasks.filter(task => task !== parseInt(value))
            setCheckedTasks(newCheckedTasks)
        }

        axios
            .put(`${server}/api/checked`, { checked, id: parseInt(value) })
    }

    console.log('checkedTasks',checkedTasks)

    return (
        <div className={styles['single-day']}>
            <Head>
                <title>Calendar: {day} </title>
                <meta name="description" content="Calendar app to track daily schedule and todos" />
                <meta name="description" content="Your schedule and tasks for a single day" />
                <link rel="icon" href="/calendar.svg" alt='By Font Awesome - Own work, OFL, https://commons.wikimedia.org/w/index.php?curid=37001111'/>
            </Head>
            {
                showDelete ?
                <DeleteItem setShowDelete={setShowDelete} handleDelete={handleDelete} id={id}/>
                : ''
            }
            <h1>{months[month]} {dayArray[1]} {dayArray[2]}</h1>
            <form onSubmit={handleFormSubmit} className={styles['single-day__form']}>
                <label>
                    Description: 
                    <input 
                        type='text'
                        name='description'
                        value={input.description}
                        onChange={handleInputChange}
                    />
                </label>
                <div>
                <h2>Type of event:</h2>
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
                </div>
                <label>
                    Time
                    <input 
                        type='number'
                        min='1'
                        max='12'
                        name='time'
                        value={input.time}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    AM
                    <input 
                        type='radio'
                        name='timeOfDay'
                        value='am'
                        checked={input.timeOfDay === 'am' ? true : false}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    PM
                    <input 
                        type='radio'
                        name='timeOfDay'
                        value='pm'
                        checked={input.timeOfDay === 'pm' ? true : false}
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
            <section className={styles['single-day__events-container']}>
                <h2>Events</h2>
               
                 <section className={styles['single-day__time-container']}>
                    <div className={styles['single-day__half-day']}>
                        <h3>AM</h3>
                        {
                            hours.map(hour => <div key={hour} className={styles['single-day__time']}>
                                {hour}
                                {
                                    events
                                        .filter(event => event.type === 'event' && event.time === hour && event.timeOfDay === 'am')
                                        .map(event => <div key={event.id} className={styles['single-day__event']}>
                                                <p className={styles['single-day__event-description']}>{event.description}</p>
                                                <div>
                                                    <button className={styles['single-day__button']}>edit</button>
                                                    <button className={styles['single-day__button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
                                                </div>
                                            </div>)
                                }
                                </div>)
                        }
                    </div>
                    <div className={styles['single-day__half-day']}>
                        <h3>PM</h3>
                        {
                            hours.map(hour => <div key={hour} className={styles['single-day__time']}>
                                    {hour}
                                    {
                                        events
                                            .filter(event => event.type === 'event' && event.time === hour && event.timeOfDay === 'pm')
                                            .map(event => <div key={event.id} className={styles['single-day__event']}>
                                                    <p className={styles['single-day__event-description']}>{event.description}</p>
                                                    <div>
                                                        <button className={styles['single-day__button']}>edit</button>
                                                        <button className={styles['single-day__button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
                                                    </div>
                                                </div>)
                                    }
                                </div>)
                        }
                    </div>
                </section>
                <h2>Tasks</h2>
                {
                    events
                        .filter(event => event.type === 'task')
                        .map(event =>  <div key={event.id} className={styles['single-day__task']}>
                        <label className={checkedTasks.includes(event.id) ? styles['single-day__task-label--checked'] : styles['single-day__task-label']}>
                            <input
                                className={styles['single-day__task-input']}
                                type='checkbox'
                                value={event.id}
                                onChange={handleCheckedTasks}
                                checked={checkedTasks.includes(event.id)}
                            />
                            {event.description}
                        </label>
                        <div>
                            <button className={styles['single-day__button']}>edit</button>
                            <button className={styles['single-day__button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
                        </div>
                    </div>)
                }
            </section>
        </div>
    )
}

export default singleDay;

export const getServerSideProps = async (context) => {
    const {day} = context.params
    
    const res = await axios.get(`${server}/api/events/${day}`)
    const checked = await axios.get(`${server}/api/checked`)

    return {
        props: {
            events: res.data || null,
            checkedItems: checked.data || null
        }
    }
}
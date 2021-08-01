import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import styles from '../../styles/SingleDay.module.scss'
import axios from 'axios'
import {server} from '../../config/index'
import DeleteItem from '../../components/DeleteItem/DeleteItem'
import EditItem from '../../components/EditItem/EditItem'
import RightArrow from '../../public/right-arrow.svg'
import LeftArrow from '../../public/left-arrow.svg'
import Image from 'next/image'


const singleDay = ({year, setYear, month, setMonth, handleDateChange, months, events, checkedItems, dayOfMonth, setDayOfMonth}) => {
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

    const [schedule, setSchedule] = useState(events)

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setInput({
            ...input,
            [name]: value.toString()
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        if(!input.description || !input.type) return setError(true)

        if(input.type === 'event' && !input.time) return setError(true)

        if(input.type === 'event' && !input.timeOfDay) return setError(true)

        axios
            .post(`${server}/api/events/${day}`, {
                ...input,
                day: parseInt(dayArray[1]),
                month,
                year
            })
            .then(res => {
                return axios.get(`${server}/api/events/${day}`)
                .then(res => setSchedule(res.data))
            })
            .catch(err => console.log('error posting event', err))

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

    interface Event {
        day: number;
        month: number;
        year: number;
        description: string;
        type: string;
        time: number;
        timeOfDay: string;
    }
    
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [editedEvent, setEditedEvent] = useState<Event>()

    const handleDelete = (e, id) => {
        e.preventDefault()

        axios
            .delete(`${server}/api/events/${day}`, {
                data: {
                    id
                }
            })
            .then(res => {
                setShowDelete(false)
            })
    }

    useEffect(()=>{
        axios.get(`${server}/api/events/${day}`)
        .then(res => setSchedule(res.data))
    },[showEdit, showDelete, day])

    const [checkedTasks, setCheckedTasks] = useState<number[]>(checkedItems.map(item=>item.item_id))

    const handleCheckedTasks = (e) => {
        const {checked, value} = e.target
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
            {
                showEdit ?
                <EditItem editedEvent={editedEvent} day={day} setShowEdit={setShowEdit}/>
                : ''
            }
            <h1>{months[month]} {dayArray[1]} {dayArray[2]}</h1>
            <div className={styles['single-day__main']}>
                <Image
                        src={LeftArrow}
                        width={50}
                        height={50}
                        alt={'Left arrow svg by FreePik'}
                        onClick={()=>setDayOfMonth(dayOfMonth - 1)}
                />
                <form onSubmit={handleFormSubmit} className={styles['single-day__form']}>
                    <div className={styles['single-day__input-container']}>
                        <label className={styles['single-day__event-heading']}>
                            Description: 
                            <input 
                                type='text'
                                name='description'
                                value={input.description}
                                onChange={handleInputChange}
                                className={styles['single-day__input']}
                            />
                        </label>
                    </div>
                    <div className={styles['single-day__input-container']}>
                        <h3 className={styles['single-day__event-heading']}>Event type:</h3>
                            <label>
                                Event
                                <input 
                                    type='radio'
                                    name='type'
                                    value='event'
                                    checked={input.type === 'event' ? true : false}
                                    onChange={handleInputChange}
                                    className={styles['single-day__input']}

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
                                    className={styles['single-day__input']}

                                />
                            </label>
                    </div>
                    {
                        input.type === 'event' ?
                        <div className={styles['single-day__input-container']}>
                            <label className={styles['single-day__event-heading']}>
                                Time:
                                <input 
                                    type='number'
                                    min='1'
                                    max='12'
                                    name='time'
                                    value={input.time}
                                    onChange={handleInputChange}
                                    className={styles['single-day__input']}
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
                        </div>
                        : ''
                    }
                    
                    <button className={styles['single-day__button']}>
                        Add
                    </button>
                    {
                        error ?
                        <p>Please fill out the entire form</p>
                        : ''
                    }
                </form>
                <Image
                        src={RightArrow}
                        width={50}
                        height={50}
                        alt={'Right arrow svg by FreePik'}
                        onClick={()=>setDayOfMonth(dayOfMonth + 1)}
                />
            </div>
            <section className={styles['single-day__events-container']}>
                <h2>Events</h2>
               
                 <section className={styles['single-day__time-container']}>
                    <div className={styles['single-day__half-day']}>
                        <h3>AM</h3>
                        {
                            hours.map(hour => <div key={hour} className={styles['single-day__time']}>
                                {hour}
                                {
                                    schedule
                                        .filter(event => event.type === 'event' && event.time === hour && event.timeOfDay === 'am')
                                        .map(event => <div key={event.id} className={styles['single-day__event']}>
                                                <p className={styles['single-day__event-description']}>{event.description}</p>
                                                <div>
                                                    <button className={styles['single-day__event-button']} onClick={()=> {setShowEdit(true); setEditedEvent(event)}}>edit</button>
                                                    <button className={styles['single-day__event-button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
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
                                        schedule
                                            .filter(event => event.type === 'event' && event.time === hour && event.timeOfDay === 'pm')
                                            .map(event => <div key={event.id} className={styles['single-day__event']}>
                                                    <p className={styles['single-day__event-description']}>{event.description}</p>
                                                    <div>
                                                        <button className={styles['single-day__event-button']} onClick={()=> {setShowEdit(true); setEditedEvent(event)}}>edit</button>
                                                        <button className={styles['single-day__event-button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
                                                    </div>
                                                </div>)
                                    }
                                </div>)
                        }
                    </div>
                </section>
                <h2>Tasks</h2>
                {
                    schedule
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
                            <button className={styles['single-day__event-button']} onClick={()=> {setShowEdit(true); setEditedEvent(event)}}>edit</button>
                            <button className={styles['single-day__event-button--delete']} onClick={()=> {setShowDelete(true); setId(event.id)}}>delete</button>
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
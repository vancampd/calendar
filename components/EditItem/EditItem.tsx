import React, { useState }from 'react'
import styles from './EditItem.module.scss'
import axios from 'axios'
import {server} from '../../config/index'

const EditItem = ({ editedEvent, day, setShowEdit}) => {

    interface Event {
        description: string;
        type: string;
        time: number | null;
        timeOfDay: string;
    }

    const [input, setInput] = useState<Event>({
        description: editedEvent.description,
        type: editedEvent.type,
        time: editedEvent.time || '',
        timeOfDay: editedEvent.timeOfDay || ''
    })

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
            .put(`${server}/api/events/${day}`, {
                ...input,
                id: editedEvent.id
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
        // setError(false)
        setShowEdit(false)
    }

    return (
        <div className={styles['overlay']}>
            <form onSubmit={handleFormSubmit} className={styles['edit-item__form']}>
                    <div className={styles['edit-item__input-container']}>
                        <label className={styles['edit-item__event-heading']}>
                            Description: 
                            <input 
                                type='text'
                                name='description'
                                value={input.description}
                                onChange={handleInputChange}
                                className={styles['edit-item__input']}
                            />
                        </label>
                    </div>
                    <div className={styles['edit-item__input-container']}>
                        <h3 className={styles['edit-item__event-heading']}>Event type:</h3>
                            <label>
                                Event
                                <input 
                                    type='radio'
                                    name='type'
                                    value='event'
                                    checked={input.type === 'event' ? true : false}
                                    onChange={handleInputChange}
                                    className={styles['edit-item__input']}

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
                                    className={styles['edit-item__input']}

                                />
                            </label>
                    </div>
                    {
                        input.type === 'event' ?
                        <div className={styles['edit-item__input-container']}>
                            <label className={styles['edit-item__event-heading']}>
                                Time:
                                <input 
                                    type='number'
                                    min='1'
                                    max='12'
                                    name='time'
                                    value={input.time}
                                    onChange={handleInputChange}
                                    className={styles['edit-item__input']}
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
                    
                    <div className={styles['edit-item__button-container']}>
                        <button className={styles['edit-item__button--cancel']} onClick={() => setShowEdit(false)}>cancel</button>
                        <button className={styles['edit-item__button']}>Update</button>
                    </div>
                    {/* {
                        error ?
                        <p>Please fill out the entire form</p>
                        : ''
                    } */}
                </form>
            </div>
    )
}

export default EditItem

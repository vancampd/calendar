import React from 'react'
import styles from './DeleteItem.module.scss'

const DeleteItem = ({setShowDelete, handleDelete, id}) => {

    return (
        <div className={styles['overlay']}>
            <div className={styles['delete-card']}>
                <h3>Are you sure you want to delete this item?</h3>
                <div className={styles['delete-card__button-container']}>
                    <button className={styles['button--cancel']} onClick={() => setShowDelete(false)}>cancel</button>
                    <button className={styles['button']} onClick={(e)=>handleDelete(e,id)}>delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteItem

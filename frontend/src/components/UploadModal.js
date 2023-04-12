import React from "react";
import { XCircleFill } from "react-bootstrap-icons";
import styles from '../styles/UploadModal.module.css'
import { useState } from "react";
const UploadModal = ({
    setUploadModalShow,
    setNewVideoShow,
    setNewImageShow
}) => {
    
    return(
        <div className ={styles.wrapper}>
        <div className={styles.title}>What do you wish to upload ?
        <XCircleFill
        onClick={()=>setUploadModalShow(false)}
         className = {`${styles.cancelButton}`}
        />
       
        </div>
        
        
        <div className={styles.modalButtons}>
            <button 
            onClick={()=>{
                setUploadModalShow(false)
                setNewImageShow(true)

            }}
            className = {`${styles.button} ${styles.createButton}`}
            >
               Image 
            </button>
            <button 
            onClick={()=>{
                setUploadModalShow(false)
                setNewVideoShow(true)

            }}
            className = {`${styles.button} ${styles.createButton}`}
            >
                Video  
            </button>
        </div>
    </div>
    )
}
export default UploadModal
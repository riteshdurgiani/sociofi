import React from "react";
import { PlusCircleFill } from "react-bootstrap-icons";
import styles from '../styles/BottomBar.module.css'
const BottomBar = () => {
    return(
        <div className={styles.wrapper}>
            
            <div className={styles.addVideoButton}>
                <PlusCircleFill
                className={styles.bottomIcon}
                // onClick = {() => setNewVideoShow(true)}
                style ={{color : 'black'}}
            
                />
            </div>
           
        </div>
    )
}

export default BottomBar
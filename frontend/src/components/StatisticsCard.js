import React from "react";
import { CameraVideoFill, CurrencyDollar, HeartFill, Image, Messenger, PersonAdd } from "react-bootstrap-icons";
import styles from '../styles/StatisticsCard.module.css'
const StatisticsCard = ({
    parameter,
    count
}) => {
    return (
        <div className={styles.wrapper}>
            
            <>
                {parameter === "images" ? <Image size="50px"/> : "" }
                {parameter === "videos" ? <CameraVideoFill size="50px"/> : "" }
                {parameter === "likes" ? <HeartFill size="50px"/> : "" }
                {parameter === "comments" ? <Messenger size="50px"/> : "" }
                {parameter === "subscribers" ? <PersonAdd size="50px"/> : "" }
                {parameter === "monetisation" ? <CurrencyDollar size="50px"/> : "" }

            </>
            <p className={styles.parameterCount}>10 {parameter} </p>
        </div>
    )
}

export default StatisticsCard
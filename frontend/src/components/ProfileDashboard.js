import React from "react";
import styles from '../styles/ProfileDashboard.module.css'
import { ArrowBarLeft, Back, Signal } from "react-bootstrap-icons";
import Link from "next/link";
import StatisticsCard from "./StatisticsCard";

const ProfileDashboard = ({
    username,
    profileLink
}) => {
    return(
        <div className={styles.wrapper}>
            <div  className={styles.brand} style={{display:'flex',justifyContent : 'flex-start',alignContent:"space-between"}}>
                <Link href="/">
                <ArrowBarLeft color="white" size={40} style={{marginTop : '10px'}}/>
                </Link>
                <img src = {profileLink} width = "50px" height="50px"></img>
                <p>{username} </p>
                
            </div>
          
            <div className= {styles.leftDiv} style={{width:'match-parent',justifyContent: 'center',alignItems:'center',borderRight : '1px solid grey'}}>
                <StatisticsCard parameter="images" count="0"/>
                <StatisticsCard  parameter="videos" count="0"/>
                <StatisticsCard  parameter="likes" count="0"/>
                <StatisticsCard  parameter="comments" count="0"/>
                <StatisticsCard  parameter="subscribers" count="0"/>
                <StatisticsCard  parameter="monetisation" count="0"/>
            </div>
        </div>
    )
}

export default ProfileDashboard;
import React from "react";
import styles from '../styles/ProfilePage.module.css'
import { Row } from "react-bootstrap";
import {Col} from "react-bootstrap";
import ProfileDashboard from "./ProfileDashboard";

const ProfilePage = ({
    username,
    profileLink,
    userStatistics,
    userVideos,
    userImages
}) => {
    console.log(userImages)
    return  (
        <div className={styles.wrapper}>
            <Row>
                <Col xs="12" sm="12" md="4" lg="4" >
                    <ProfileDashboard
                    username = {username}
                    profileLink = {profileLink}
                    userStatistics={userStatistics}
                    />
                </Col>
                <Col xs="12" sm="12" md="8" lg="8">
                    <div style={{
                        display : "grid",
                        gridTemplateColumns : "repeat(4, 1fr)",
                        gridRowGap : "10px"
                    }}>
                        {userImages.map((image,index) => (
                            <img key={index} src={image.account.imageUrl} width="200px" height="200px"/>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ProfilePage
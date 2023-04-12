import React from "react";
import styles from '../styles/ProfilePage.module.css'
import { Row } from "react-bootstrap";
import {Col} from "react-bootstrap";
import ProfileDashboard from "./ProfileDashboard";

const ProfilePage = ({
    username,
    profileLink
}) => {
    return  (
        <div className={styles.wrapper}>
            <Row>
                <Col xs="12" sm="12" md="4" lg="4" >
                    <ProfileDashboard
                    username = {username}
                    profileLink = {profileLink}
                    />
                </Col>
                <Col xs="12" sm="12" md="8" lg="8">
                    <div>
                        
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ProfilePage
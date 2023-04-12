import ProfilePage from "../components/ProfilePage";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
const profile = () => {
    const router = useRouter()
   
    const username = router.query.username
    const profileLink = router.query.profileLink

    return  (
        <ProfilePage
        username = {username}
        profileLink = {profileLink}
        />
    )
}

export default profile
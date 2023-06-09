import ProfilePage from "../components/ProfilePage";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { useWallet } from "@solana/wallet-adapter-react";
const profile =  () => {

    const wallet = useWallet()
    const rt = useRouter()
    
    const db = getFirestore(app)
    const [userName,setUsername] = useState()
    const [userProfile,setUserProfile] = useState()
    const [userStatistics,setUserStatistics] = useState({})
    const userVideos = rt.query.userVideos
    const userImages = rt.query.userImages
    console.log(userImages)
//    const userAddress = wallet.publicKey.toString()
   async function getUser(){
    const userAddress =  rt.query.userAddress
    console.log("IN NEW PAGE ")
    console.log(userAddress)
    const docRef = await getDoc(doc(db,"users",userAddress))
    const data = docRef.data()
    setUsername(data.username)
    setUserProfile(data.userprofile)

    userStatistics.videosPosted = data.videosPosted
    userStatistics.imagesPosted = data.imagesPosted
    userStatistics.totalLikes = data.totalLikes
    userStatistics.totalComments = data.totalComments
    userStatistics.isverified = data.isverified
    userStatistics.hascommunity = data.hascommunity

    setUserStatistics(userStatistics)
   }
   useEffect(()=>{
        getUser()
   },[])
    return  (
        <ProfilePage
        username = {userName}
        profileLink = {userProfile}
        userStatistics = {userStatistics}
        userVideos = {userVideos}
        userImages = {userImages}
        />
    )
}

export default profile
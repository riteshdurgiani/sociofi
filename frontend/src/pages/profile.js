import ProfilePage from "../components/ProfilePage";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { useWallet } from "@solana/wallet-adapter-react";
const profile =  () => {

    const wallet = useWallet()

    const db = getFirestore(app)
    const [userName,setUsername] = useState()
    const [userProfile,setUserProfile] = useState()
//    const userAddress = wallet.publicKey.toString()
   async function getUser(){
    console.log("IN NEW PAGE ")
    // console.log(userAddress)
    // const docRef = await getDoc(doc(db,"users",wallet.publicKey.toString()))
    const data = docRef.data()
    setUsername(data.username)
    setUserProfile(data.userprofile)
   }
   useEffect(()=>{
        getUser()
   },[])
    return  (
        <ProfilePage
        username = {userName}
        profileLink = {userProfile}
        />
    )
}

export default profile
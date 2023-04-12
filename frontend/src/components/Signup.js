import React from "react";
import styles from '../styles/Signup.module.css'
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import useAccount from "../hooks/useAccount";
import { ToastContainer } from "react-toastify";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";

const Signup = ({signup,isLoading,setIsLoading,isAccount,setAccount}) => {
    const {getUsernames} = useAccount()
    const db = getFirestore(app)
    const [username , setUsername] = useState();
    const [profile,setProfile] = useState();
    const [showAlert,setShowAlert] = useState(false)
    async function checkUsernameAvailable(name){
       const d = await getDocs(collection(db,"users"))

       d.forEach((doc) => {
        const data = doc.data()
        if(data.username == name){
            setShowAlert(true)
            alert("Username Already Taken ")
            document.getElementById('ip').value = ""
        }else{
            setUsername(name)
        }
       })
    }
    const signUpClicked=() =>{
        setIsLoading(true)
        console.log("Signup  clicked ")
        signup(username,profile)
        
        setIsLoading(false)
        setAccount(true)
    }
    return(
        <div style={{height : "100%" , width : "100%" , backgroundColor : "#020102"}}>
            {showAlert ? <ToastContainer>Username Already Taken </ToastContainer> : ""}
        <div className={styles.authContainer}>
             {isLoading ? <LoadingSpinner /> : ""}
            <h1 className={styles.title}> Sign up to use SocioFi</h1>
            <div className={styles.signupForm}>
                <div className={styles.inputField}>
                    <div className={styles.inputTitle}>
                        Username
                    </div>
                    <div className={styles.inputContainer}>
                        <input id="ip" className={styles.input} type='text' 
                        onChange={(e)=>{
                            checkUsernameAvailable(e.target.value)
                        }}
                        />
                    </div>
                </div> 
                <div className={styles.inputField}>
                    <div className={styles.inputTitle}>
                        Profile Image 
                    </div>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} type='text' 
                        onChange={e=> setProfile(e.target.value)}
                        />
                    </div>
                </div> 
            </div>
            <div className={styles.loginButton} 
            onClick={signUpClicked}
            >
        Sign up
      </div>
        </div>
        </div>
    )
}

export default Signup
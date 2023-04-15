import React, { useEffect } from "react";
import styles from '../styles/Signup.module.css'
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import useAccount from "../hooks/useAccount";
import { ToastContainer } from "react-toastify";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { Dropdown } from "react-bootstrap";

const Signup = ({signup,isLoading,setIsLoading,isAccount,setAccount}) => {
    
    const {getUsernames} = useAccount()
    const db = getFirestore(app)
    const [username , setUsername] = useState();
    const [profile,setProfile] = useState();
    const [showAlert,setShowAlert] = useState(false)
    const styleOptions = ["pixel-art","adventurer","fun-emoji","personas"]
    const [selectedStyle,setSelectedStyle] = useState('')
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
    const signUpClicked=async() =>{
        setIsLoading(true)
        
        console.log("Signup  clicked ")
        
       
        await signup(username,profile)
        alert("Singup Successful")
        setIsLoading(false)
        setTimeout(()=>{
            setAccount(true)
        },1000)
        window.location.reload()
       
    }
    useEffect(()=>{
        setAvatar()
    },[selectedStyle])
    function setAvatar(){
        const aName = document.getElementById("avatarName").value 
        if(aName != ""){
            const avatarUrl = "https://api.dicebear.com/6.x/" + selectedStyle + "/svg?seed=" + aName
            document.getElementById("avatarImage").src = avatarUrl
            console.log("avatarrrrrr")
            console.log(avatarUrl)

            setProfile(avatarUrl)
        }
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
                
                <div className={styles.inputField} style={{display : "flex" , flexDirection : "row",padding : "5px"}}>
                    <Dropdown> 
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark" >
                        Select Style
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        {styleOptions.map((styleOption,index)=>(
                            <Dropdown.Item key={index} onClick={()=>{
                               setSelectedStyle(styleOption.toString())
                              
                            }} >{styleOption}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                    </Dropdown>
                    <div className={styles.inputField} style={{marginTop : "5px"}}>
                    <div className={styles.inputTitle}>
                        Avatar Name  
                    </div>
                    <div className={styles.inputContainer}>
                        <input id="avatarName" className={styles.input} type='text' 
                        onChange={()=>{
                            setAvatar()
                        }}
                        />
                    </div>
                </div> 
                </div> 
               <center>
                <div className={styles.inputField}>
                    <div className={styles.inputTitle} > 
                        Your Avatar : 
                    </div>
                    <img id="avatarImage" width="100px" height = "100px" alt=""/>
                </div> 
                </center>
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
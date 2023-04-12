import React, { useEffect, useState } from "react";
import styles from "../styles/ChatModal.module.css"
import { Card } from "react-bootstrap";
import { addDoc, collection, getDoc, getFirestore, onSnapshot, orderBy, setDoc, where } from "firebase/firestore";
import { doc } from "firebase/firestore";

// import { async } from "@firebase/util";
import { getDocs,query } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import LoadingSpinner from "./LoadingSpinner";
import { XCircleFill } from "react-bootstrap-icons";
const ChatModal = ({
    userAddress,
    chatAddress,
    chatModalShow,
    setChatModalShow,
    isLoading,
    setIsLoading
}) => {
    const db = getFirestore(app)
    const [owner,setOwner] = useState('')
    const [ownerProfile,setOwnerProfile] = useState('')
    const [messages,setMessages] = useState([])
    const [textToSend,setTextToSend] = useState('')
    const [messageAdded,setMessageAdded] = useState(false)
    async function getChannelDetails(){
        const docRef = doc(db,"channels",chatAddress);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data()
        setOwner(data.owner)
       setOwnerProfile(data.ownerprofile)

        // console.log(owner + " " + ownerProfile)
    }
    async function getUser(address){
        const docRef = await getDoc(doc(db,"users",address));
        const data = docRef.data()
        console.log(data)
        return data.userprofile
    }
    async function getMessages(){
    setIsLoading(true)
       const docRef  = query(collection(db,"messages",chatAddress,chatAddress + "_messages"),orderBy("createdAt"))
       const d = await getDocs(docRef)
       
       const messageList = []
       messages.forEach((m) => {
        messageList.push(m)
       })
       d.forEach(async (dc) => {
            const msgObj = {}
            const data = dc.data()
            msgObj.user = await getUser(data.createdBy)
            msgObj.text = data.text
            msgObj.createdAt = data.createdAt
            
            messageList.push(msgObj)
       })
       
       messages = messageList  
      
       console.log(messages.length)
    setIsLoading(false)
      
       console.log(messages)
       setTimeout(()=>{
        setMessages([...messages].sort(function(a,b){
            return a.createdAt.seconds - b.createdAt.seconds
           }))
    },2000)
       
       
    }
    async function sendMessage(){
        await addDoc(collection(db,"messages",chatAddress,chatAddress+"_messages"),{
            createdAt : new Date(),
            createdBy : userAddress,
            text : textToSend
        })
        setTextToSend('')
        messages = []
        setMessages([...messages])
       getMessages()
        
        
    }
    useEffect(()=>{
        
        getChannelDetails()
        getMessages()
        getMessages()
    },[chatAddress])
   
    // useEffect(()=>{
        
      
    // },[messages])
  return (
    <div>
        <Card className={styles.wrapper}>
            {isLoading ? <LoadingSpinner/> : ""}
            <Card.Header className={styles.wrapperTile}>
                <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between"}}>
                <div><img src={ownerProfile} height="50" width="50"/> <div><p>{owner}</p></div></div>
                <div><XCircleFill
                            onClick={()=>setChatModalShow(false)}
                            className = {`${styles.cancelButton}`}
                            />
                </div>
                </div>
            </Card.Header>
            <Card.Body >
              <div   className={styles.leftDiv} 
            style={{ color : "white" , 
            display : "flex", }}>
                {messages.length == 0 ? "" : (
                    messages.map((msg,id)=>(
                        <div key={id} style={{marginBottom : "10px", border: "0.6px solid black" , borderRadius : "10px" ,display : "flex" , flexDirection : "row" , width : "fit-content" , height : 'fit-content',justifyContent : "left"}}>
                            
                            <img src={msg.user} height="30px" width="30px" />
                            <p>{msg.text}</p>
                        </div>
                    ))
                )}
           </div>
            </Card.Body>
            <Card.Footer className={styles.wrapperFooter}>
            <div className={styles.inputField}>
               
                <div className={styles.inputContainer}>
                    <input
                    className={styles.input}
                    enterKeyHint="Message"
                    type = 'text'
                    value={textToSend}
                    onChange = {e=>setTextToSend(e.target.value)}
                    />
                </div>
            </div>
           
               
                <button 
                onClick={() =>{
                    sendMessage()
                }}
                className = {`${styles.button} ${styles.createButton}`}
                >
                   Send
                </button>
           
            </Card.Footer>
        </Card>
    </div>
  );
}


export default ChatModal
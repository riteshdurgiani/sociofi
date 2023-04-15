import React, { useEffect, useState } from "react";
import styles from '../styles/Footer.module.css'
import { useWallet } from "@solana/wallet-adapter-react";
import { addDoc, collection, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { PatchCheckFill } from "react-bootstrap-icons";
import { SOLANA_HOST } from "../utils/const";
import { getDocs } from "firebase/firestore";
const anchor = require('@project-serum/anchor')
const Footer =  (
    {address,
        userDetail,
        channel,
        description,
        song,
        video,
       
    }
) => {
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const wallet = useWallet();
    const [verified,setVerified] = useState([])
    const [community,setCommunity] = useState([])
    const { publicKey, sendTransaction } = useWallet();
    const db = getFirestore(app)
    async function sendSolana(video) {
        //TODO : Create a wallet select button on the header and display balance solana on the header 
        //Refer facebook video  use WalletMultiButton : )
        
      try{
       
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: wallet.publicKey,
              toPubkey: video.account.authority,
              lamports: 10_000_000,
            })
          );
          const signature = await sendTransaction(transaction, connection);

          await connection.confirmTransaction(signature, "processed");

          console.log("SOL SENT ")
      }catch(e){
        
      }
        
      }
    async function joinCommunity(address,userDetail){
       
        const adddr = video.account.authority.toString()
        console.log(video.account.authority.toString())
       const docRef =  doc(db, "channels", adddr);
       const docSnap = await getDoc(docRef);
       console.log("docSnappp")
       console.log(docSnap.exists())
       if(docSnap.exists()){
        console.log("hello")
        await sendSolana(video)
        const innerdocRef = await doc(db, "channels", adddr,  adddr + "_channel",  wallet.publicKey.toString());
       console.log(userDetail)
        await setDoc(innerdocRef,{
            username : userDetail.userName,
            userprofile : userDetail.userProfileImageUrl,
            owner : "no"
        })
       }
       window.location.reload()
    }
    async function isVerified (name){
        const docs = await getDocs(collection(db,"users"))
    
     
        docs.forEach((doc)=>{
            const data = doc.data();
            if(data.isverified == "yes" && doc.username === name){
               return true
            }
            else{
                return false
            }
        })
    }
    async function hasCommunity (name){
        
         setTimeout(async ()=>{
            const docs =  await getDocs(collection(db,"users"))
        docs.forEach((doc)=>{
            const data = doc.data();
            if(data.hascommunity == "yes" && doc.username === name){
               return true
            }
            else{
                return false
            }
        })
    },3000)
       
    }
    async function isVerifedList(){
        const docs = await getDocs(collection(db,"users"))
    
        const vList = []
        const cList = []
        docs.forEach((doc)=>{
            const data = doc.data();
            if(data.isverified === "yes"){
                console.log("In verified")
                vList.push(data.username)
            }
            if(data.hascommunity === "yes"){
                cList.push(data.username)
            }
        })
        verified = vList;
        community = cList
        setTimeout(()=>{
            setVerified([...verified])
            setCommunity([...community])
        },3000)
        console.log(verified)
        console.log(community)
        console.log(video)
    }
    useEffect(()=>{
        setTimeout(()=>{
            isVerifedList()
        },4000)
    },[])
    
    return(
        <div className={styles.footer}>
            <div className={styles.footerText}>
                <h4>@{channel}
                 {video.isverified == "yes" ? <PatchCheckFill color="lightBlue"/> : ""}
                 </h4>
                <p>{description} </p>
                
            </div>
            <div className={styles.footerRecord}>
                { video.hascommunity == "yes" ? 
                 <button 
                onClick= {() => {
                    joinCommunity(address,userDetail)
                }}
                className = {`${styles.button} ${styles.createButton}`}
                >
                    Join 
                </button> 
              : ""} 
            
            </div>
        </div>
    )
}

export default Footer;
import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import styles from '../styles/Footer.module.css'
import { addDoc, collection, getDoc, getFirestore, onSnapshot, orderBy, setDoc, where } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { PatchCheckFill } from "react-bootstrap-icons";
import { SOLANA_HOST } from "../utils/const";

// import { async } from "@firebase/util";
import { getDocs,query } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
const SuggestedChannelTile = ({
    channel,
    profile,
    address,
    chatModalShow,
    setChatModalShow,
    chatAddress,
    setChatAddress,
    userDetail
}) => {
    const db = getFirestore(app)
    const wallet = useWallet()
    const { publicKey, sendTransaction } = useWallet();
    async function sendSolana(video) {
        //TODO : Create a wallet select button on the header and display balance solana on the header 
        //Refer facebook video  use WalletMultiButton : )
        
      try{
       
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: wallet.publicKey,
              toPubkey: new PublicKey(video),
              lamports: 10_000_000,
            })
          );
          const signature = await sendTransaction(transaction, connection);

          await connection.confirmTransaction(signature, "processed");

          console.log("SOL SENT ")
      }catch(e){
        
      }
        
      }
    async function joinCommunity(){
       
        
       const docRef =  doc(db, "channels", address);
       const docSnap = await getDoc(docRef);
       console.log("docSnappp")
       console.log(docSnap.exists())
       if(docSnap.exists()){
        console.log("hello")
        sendSolana(address)
        const innerdocRef = await doc(db, "channels", address,  address + "_channel",  wallet.publicKey.toString());
       console.log(userDetail)
        await setDoc(innerdocRef,{
            username : userDetail.userName,
            userprofile : userDetail.userProfileImageUrl,
            owner : "no"
        })
       }
       window.location.reload()
    }
    return (
        
        <div style={{
            
            padding : '20px',color:'white',fontWeight : 'bold',fontSize : '1rem',
            boxShadow:  '8px 8px 5px #15101f, 8px -8px 5px #33264b'
        
        }}>
        <Row>
            <Col sm="2" xs="2" md="2" lg="2">
                <img height='50px' width='50px' src={profile} />
            </Col>
            <Col sm="6" xs="6" md="6" lg="6" style={{display : 'flex',flexDirection : 'column',alignContent : 'flex-start'}}>
                
                    <p>{channel}</p>
                    <p style={{fontWeight : 'lighter' , fontSize : '0.8rem'}}>10 members </p>
                
            </Col>
            <Col sm="4" xs="4" md="4" lg="4">
            <button 
                onClick = {()=>{
                    joinCommunity()
                }}
                className = {`${styles.button} ${styles.createButton}`}
                >
                    Join 
                </button>
            </Col>
        </Row>
    </div>
    )
}

export default SuggestedChannelTile
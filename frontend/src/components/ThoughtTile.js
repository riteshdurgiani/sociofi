import React, { useState } from "react";
import styles from '../styles/PostThought.module.css'
import { Card } from "react-bootstrap";
import { BalloonHeartFill, ChatDotsFill, CurrencyDollar } from "react-bootstrap-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import CommentsThought from "./CommentsThought";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
const ThoughtTile = ({
    
    address,
    
    channel,
    index,
    likes,
    description,
    likeThought,
    likesAddress,
    createCommentThought,
    getThoughtComments,
    commentCountThought,
    connection,
    thought,
   
}) => {
    const [liked,setLiked] = useState(false);
    const [showThoughtComments,setShowThoughtCommentsModal] = useState(false)
    const wallet = useWallet()
    const { publicKey, sendTransaction } = useWallet();
    useEffect(()=>{
        if(wallet.connected){
            console.log("WALLETTTT")
            console.log(wallet)
            if(likesAddress){
                likesAddress.forEach(address =>{
                    if(wallet.publicKey.toBase58() === address.toBase58()){
                        setLiked(true)
                    }
                })
            }
           
        }
    },[wallet,likesAddress]);
    async function sendSolana() {
        //TODO : Create a wallet select button on the header and display balance solana on the header 
        //Refer facebook video  use WalletMultiButton : )
        
       try{
        console.log(publicKey)
        console.log(address)
        // console.log(video)
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: thought.account.authority,
              lamports: 10_000_000,
            })
          );
          const signature = await sendTransaction(transaction, connection);

          await connection.confirmTransaction(signature, "processed");

          alert("SOL sent successfully ")
       }catch(e){
        alert(e)
       }
        
    }
    return (
        <Card className = {styles.wrapperTile}>
            <Card.Header className={styles.inputTitleHead}>@{channel}</Card.Header>
            <Card.Body>
               
                    
                    <div className={styles.inputTitleTile}>{description} </div>
                    
                
                <div style={{display : 'flex',justifyContent:'space-between'}}>
                            <div style={{display : 'flex' , flexDirection : 'column',color : 'white',alignItems : "center"}}>
                            {liked ? (
                                <BalloonHeartFill
                                    size="30px"
                                    style={{fill:'red',stroke:'red'}}
                                    color = "red"
                                />
                            
                                ) : (
                                    <BalloonHeartFill
                                    size="30px"
                                    color="white"
                                    onClick={e => {
                                        likeThought(address)
                                    }}
                                />
                                )}
                            {likes}
                            </div>
                            <div style={{display : 'flex' , flexDirection : 'column',color : 'white',alignItems : "center"}}>
                            <ChatDotsFill
                            size='20px'
                            color="white"
                            onClick={() => {
                                setShowThoughtCommentsModal(true)
                            }}
                            />
                            {commentCountThought}
                            </div>
                            <div style={{display : 'flex' , flexDirection : 'column'}}>
                            <CurrencyDollar
                            size='20px'
                            color="white"
                            onClick={sendSolana}
                            />
                            
                            </div>
                            
                            
                </div>
                {showThoughtComments && <CommentsThought
                            address = {address}
                            setShowThoughtCommentsModal = {setShowThoughtCommentsModal}
                            createCommentThought = {createCommentThought}
                            index = {index}
                            getThoughtComments = {getThoughtComments}
                            commentCountThought = {commentCountThought}
                            />}     
            </Card.Body>
                  
        </Card>
    )
}


export default ThoughtTile                    
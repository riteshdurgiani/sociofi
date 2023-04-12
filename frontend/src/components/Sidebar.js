import React from "react";
import { useState } from "react";
import styles from '../styles/Sidebar.module.css'
import { CashCoin, ChatDotsFill } from "react-bootstrap-icons";
import { ShareFill } from "react-bootstrap-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { BalloonHeartFill } from "react-bootstrap-icons";
import { useEffect } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
const Sidebar = ({
    address,
    likes,
    shares,
    messages,
    onShowComments,
    likeVideo,
    index,
    likesAddress,
    connection,
    video
}) => {
  
    const [liked,setLiked] = useState(false);
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
        console.log(video)
        const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: video.account.authority,
              lamports: 10_000_000,
            })
          );
          const signature = await sendTransaction(transaction, connection);

          await connection.confirmTransaction(signature, "processed");

          alert("SOL sent successfully ")
       }catch(e){
        alert("OOps Transaction cancelled  ")
       }
        
    }
    return (
        <div className={styles.sidebar}>
            <div className={styles.sideBarButton}>
                {liked ? (
                     <BalloonHeartFill
                     size="30px"
                     style={{fill:'red',stroke:'red'}}
                 />
            
                ) : (
                    <BalloonHeartFill
                     size="30px"
                     onClick={e => {
                        likeVideo(address)
                      }}
                 />
                )}
                   
                <p>{likes}</p>
            </div>
            <div className={styles.sideBarButton} 
            onClick={onShowComments}
            >
                <ChatDotsFill
                    size="20px"
                />
               
            </div>
            <p>{messages}</p>
            <div className={styles.sideBarButton}
             onClick={sendSolana}
            >
                <CashCoin
                    size="25px"
                />
                
            </div>
            
        </div>
    )
}

export default Sidebar
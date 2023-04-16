import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Search, Signal } from "react-bootstrap-icons";

import { useWallet } from "@solana/wallet-adapter-react";
import { async } from "@firebase/util";
import { db } from "./firebase";
import { addDoc, collection, getDoc, getFirestore, setDoc } from "firebase/firestore";
import Link from "next/link";
import { SOLANA_HOST } from "../utils/const";
import { LAMPORTS_PER_SOL,PublicKey,clusterApiUrl } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import app from "../firebaseUtils/fbConfig";
import { doc } from "firebase/firestore";
// import { async } from "@firebase/util";
import { getDocs,query } from "firebase/firestore";
import { useEffect } from "react";
import useAccountDetails from "../hooks/useAccountDetails";
import styles from '../styles/UploadImageModal.module.css'
import SearchBar from "./SearchBar";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
const NavbarApp = ({
  userDetail,
  mainViewImageShow,
  mainViewVideoShow, 
  setMainViewImageShow,
  setMainViewVideoShow,
 joinedCommunities,
 setJoinedCommunities,
 isLoading,
 setIsLoading,
 searchTerm,
 setSearchTerm,
 users,
 topics,
 trendingMainView,
setTrendingMainView,
videos,
images
}) => { 
  const db = getFirestore(app)
  const [balance,setBalance] = useState('')
  const [userAccountDetails,setUserAccountDetails] = useState('')
  const [isEligibleForVerification,setIsEligibleForVerification] = useState(false)
  const [showCommunityCreation,setShowCommunityCreation] = useState(false)
  const SOLANA_HOST = clusterApiUrl(SOLANA_HOST)
const connection = new anchor.web3.Connection(SOLANA_HOST)
const wallet = useWallet();
const { publicKey, sendTransaction } = useWallet();
// getCommunities()

async function gBalance(){
  let lamportBalance;
  if (wallet?.publicKey) {
    const balance = await connection.getBalance(wallet.publicKey)
    lamportBalance=(balance / LAMPORTS_PER_SOL)
  }
  setBalance(lamportBalance)
}
 gBalance()
      
  const {getCountAccountDetails} = useAccountDetails();
  async function getAccDetails(){
    const data  = await getCountAccountDetails()
    return data;
  }
  

      async function createChannel(){
        setIsLoading(true)

            try{
              const docRef = await doc(db, "channels", wallet.publicKey.toString());
              setDoc(docRef,{
                owner : userDetail.userName,
                ownerprofile : userDetail.userProfileImageUrl,
              })
              const innerdocRef = await doc(db, "channels", wallet.publicKey.toString(),  wallet.publicKey.toString() + "_channel",  wallet.publicKey.toString());
              setDoc(innerdocRef, {
                username : userDetail.userName,
                userprofile : userDetail.userProfileImageUrl,
                owner : "yes"
             });
             await setDoc(doc(db,"messages",wallet.publicKey.toString()),{
              createdAt : new Date(),
              createdBy : wallet.publicKey.toString(),
              text : "Welcome to my Community 😇"
             })
             const innerdocRefMsg = doc(db, "messages", wallet.publicKey.toString(),  wallet.publicKey.toString() + "_messages",  wallet.publicKey.toString());
             await setDoc(innerdocRefMsg,{
              createdAt : new Date(),
              createdBy : wallet.publicKey.toString(),
              text : "Welcome to my Community 😇"
             })

             const d = doc(db,"users",wallet.publicKey.toString());
             await setDoc(d,{
              hascommunity : "yes"
             },{merge : true})


             alert("Community Created Successfully")
             window.location.reload()
         setIsLoading(false)
        }catch(e){
         
          console.log(e)
        }
      }
      async function verifyUser(){
        try{
         
          const transaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new web3.PublicKey("AYPGr8MqcaD5UuGFGgAHq2VUuciQZtJbkW73ahC365Gx"),
                lamports: 1_000_000_000,
              })
            );
            const signature = await sendTransaction(transaction, connection);
              
           
            setTimeout(async () => {
              await connection.confirmTransaction(signature, "processed");
            },5000)
             const docRef = doc(db,"users",wallet.publicKey.toString())
             await setDoc(docRef,{
              isverified : "yes"
             },{merge : true})
            alert("User Verified Successfully")

            setIsEligibleForVerification(false)


         }catch(e){
          console.log(e)
          alert("OOps Transaction cancelled  ")
         }
      }
      async function checkVerificationEligibility(){
        const docRef = await getDoc(doc(db,"users",wallet.publicKey.toString()))
        if(docRef.exists()){
          const data = docRef.data();
          if(data.isverified === "yes"){
            setIsEligibleForVerification(false)
            if(data.hascommunity === "no"){
            
            // const q = await getDocs(collection(db,"users"))
            // const totalUsers = q.length;
            // const comm = await getDocs(collection(db,"channels",wallet.publicKey.toString(),wallet.publicKey.toString() + "_channel"))
            // const totalFollowers = comm.length;
            // if(totalFollowers === 0.10*totalUsers){
            //   setIsEligibleForVerification(true)
            // }
            setShowCommunityCreation(true)
            }
          }else{
            
            setShowCommunityCreation(false)
            setIsEligibleForVerification(true)
          }
        }

      }
      useEffect(()=>{
        checkVerificationEligibility()
      },[userDetail,isEligibleForVerification])
    return(
        <Navbar collapseOnSelect expand="lg"  variant="dark" sticky="top" style={{width:'100%',background : '#020102',borderBottom:'0.1px solid #241B35 '}}>
      <Container>
        <Navbar.Brand href=""><Signal color="white" size={30}/> SocioFi</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" >
            <Nav.Item>
            <Nav.Link href="" onClick={() => {
              setTrendingMainView(false)
              setMainViewVideoShow(false)
              setMainViewImageShow(true)
            }}
            
            >Images</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link href="" onClick={() => {
              setTrendingMainView(false)
              setMainViewImageShow(false)
              setMainViewVideoShow(true)  
            }}>Videos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link href="" onClick={()=>{
              setMainViewImageShow(false)
              setMainViewVideoShow(false)
              setTrendingMainView(true)
            }}>Trending</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
            <Nav.Link href="">Channels</Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <SearchBar 
              placeholder= "@username or #topicname"
              data={topics.concat(users)}
              searchTerm = {searchTerm}
              setSearchTerm = {setSearchTerm}
              />
            {/* <div className={styles.inputContainer} style={{color : "white"}}>
                        <input
                        className={styles.input}
                        type = 'text'
                        // value = {imageKeywords}
                        placeholder="Eg #happiness for topic or @abc for user"
                        onChange = {()=>{}}
                        />
                        <Search width="20px" height="20px" color="white"/>
                    </div> */}
            </Nav.Item>
          </Nav>
          <Nav>
         {isEligibleForVerification ? ( 
            <button 
            onClick={() => {
              verifyUser()
            }}
            style={{
              color: 'white',
              padding: '5px',
              backgroundColor : '#CB80FF',
              borderRadius:'9px',
              color: '#fff',
              cursor: 'pointer',
              transition: '0.2 linear',
              width: '8rem',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              fontWeight: '600',
              fontSize: '1rem',
              margin: '0.5rem',
              boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)'
            }}>
            Verify Me !
            </button>
           
          ) : ""}
            {showCommunityCreation ? (
              
               <button 
               onClick={() => {
                 createChannel()
               }}
               style={{
                 color: 'white',
                 padding: '5px',
                 backgroundColor : '#CB80FF',
                 borderRadius:'9px',
                 color: '#fff',
                 cursor: 'pointer',
                 transition: '0.2 linear',
                 width: '8rem',
                 alignItems: 'center',
                 justifyContent: 'center',
                 display: 'flex',
                 fontWeight: '600',
                 fontSize: '1rem',
                 margin: '0.5rem',
                 boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)'
               }}>
               Create
               Community 
               </button>
              
             
            ) : ""}
          <Link href="">
            <button 
            onClick={() => {
              
            }}
            style={{
              color: 'white',
              padding: '5px',
              backgroundColor : '#CB80FF',
              borderRadius:'9px',
              color: '#fff',
              cursor: 'pointer',
              transition: '0.2 linear',
              width: '8rem',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              fontWeight: '600',
              fontSize: '1rem',
              margin: '0.5rem',
              boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)'
            }}>
            
            {balance}
            </button>
           
          </Link>
         
            <Link href=""
          //   href={{
          //   pathname : '/profile',
          //   query :{
          //     userAddress : wallet.publicKey.toString(),
          //     userVideos : videos,
          //     userImages : images,
          //   }
           
          // }}
          >
            <button style={{
              color: 'white',
              padding: '5px',
              backgroundColor : '#8965F1',
              borderRadius:'9px',
              color: '#fff',
              cursor: 'pointer',
              transition: '0.2 linear',
              width: '8rem',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              fontWeight: '600',
              fontSize: '1rem',
              margin: '0.5rem',
              boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)'
            }}>
              <>
              {userDetail ? <div><img src={userDetail.userProfileImageUrl} height={40} width={40}/> {userDetail.userName}</div>
             : ""}
              </>
            
            </button>
            </Link>
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default NavbarApp;
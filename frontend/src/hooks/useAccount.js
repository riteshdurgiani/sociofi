import { useEffect } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

import { getProgramInstance } from "../utils/utils";
import { SOLANA_HOST } from "../utils/const";
import app from "../firebaseUtils/fbConfig";
import {  collection, getDocs, getFirestore } from 'firebase/firestore';

import { doc,setDoc } from "firebase/firestore";
const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const {BN,web3} = anchor 
const {SystemProgram } = web3

const db = getFirestore(app)
const defaultAccounts = {
    tokenProgram : TOKEN_PROGRAM_ID,
    clock : anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram : SystemProgram.programId
}
async function addUserInFirebase(docId,username,userprofile){

    await setDoc(doc(db,"users",docId.toString()),{
        username : username,
        userprofile : userprofile,
        isverified : "no",
        hascommunity : "no",
        totalLikes : 0,
        videosPosted : 0,
        imagesPosted : 0,
        totalComments : 0
    });
}
const useAccount = () => {
    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance(connection,wallet)
   
    const signup = async (name, profile) => {
        let [user_pda]  = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('user'),wallet.publicKey.toBuffer()],program.programId
        )

        await program.rpc.createUser(name,profile,{
            accounts : {
                user : user_pda,
                authority : wallet.publicKey,...defaultAccounts,
            },
        })

        await addUserInFirebase(wallet.publicKey,name,profile)


        console.log("user signed up ")
    }

    return {signup}
}

export default useAccount;
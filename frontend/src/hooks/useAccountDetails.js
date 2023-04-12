import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { render } from "react-dom";
const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const {BN,web3} = anchor
const {SystemProgram} = web3

const defaultAccounts = {
    tokenProgram : TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram : SystemProgram.programId
}

const useAccountDetails = (
   
) => {
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const program = getProgramInstance(connection,wallet);

    const getCountAccountDetails = async () => { 
        const userAccountDetails = {}
        const videoCount = 0;
        const imageCount = 0;
        const thoughtCount = 0;
        const commentCount = 0;
        const likeCount = 0;
        const totalVideoCount = 0;
        const totalImageCount = 0;
        const totalThoughtCount = 0;
        const videos = await program.account.videoAccount.all();
        setTimeout(()=>{

        },2000)
        const images = await program.account.imageAccount.all();
        setTimeout(()=>{

        },2000)
        const thoughts = await program.account.thoughtAccount.all();

        videos.forEach((video)=>{
            totalVideoCount = totalVideoCount + 1;
            if(video.account.authority.toString() === wallet.publicKey.toString()){
                videoCount = videoCount + 1;
                likeCount = likeCount + video.account.likes;
                const currCommCount = video.account.commentCount
                commentCount = commentCount + currCommCount.toNumber()

            }
        })
        images.forEach((image) => {
            totalImageCount = totalImageCount + 1;
            if(image.account.authority.toString() === wallet.publicKey.toString()){
                imageCount = imageCount + 1;
                likeCount = likeCount + image.account.likes;
                const currCommCount = image.account.commentCount
                commentCount = commentCount + currCommCount.toNumber()
            }
        })
        thoughts.forEach((thought) => {
            totalThoughtCount = totalThoughtCount + 1;
            if(thought.account.authority.toString() === wallet.publicKey.toString()){
                thoughtCount = thoughtCount + 1;
                likeCount = likeCount + thought.account.likes;
                const currCommCount = thought.account.commentCount
                commentCount = commentCount + currCommCount.toNumber()
            }
        })
       userAccountDetails.videoCount = videoCount;
       userAccountDetails.imageCount = imageCount;
       userAccountDetails.likeCount = likeCount;
       userAccountDetails.commentCount = commentCount;
       userAccountDetails.thoughtCount = thoughtCount;
       userAccountDetails.totalVideoCount = totalVideoCount;
       userAccountDetails.totalImageCount = totalImageCount;
       userAccountDetails.totalThoughtCount = totalThoughtCount

       return userAccountDetails
        
    }

   

    return {getCountAccountDetails}
}

export default useAccountDetails;
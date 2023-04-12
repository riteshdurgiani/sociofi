import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore,addDoc,setDoc,doc,getDoc, arrayUnion } from "firebase/firestore";
import { render } from "react-dom";
import app from "../firebaseUtils/fbConfig";
const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const {BN,web3} = anchor
const {SystemProgram} = web3
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
const defaultAccounts = {
    tokenProgram : TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram : SystemProgram.programId
}

const useVideos = (
    setVideos,
    userDetail,
    videoUrl,
    description,
    setDescription,
    setVideoUrl,
    setNewVideoShow,
    isLoading,
    setIsLoading,
    users,
    topics,
    searchTerm
) => {
    const db = getFirestore(app)
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const program = getProgramInstance(connection,wallet);

    const getVideos = async () => { 
        setIsLoading(true)
        const videos = await program.account.videoAccount.all();
        // if(searchTerm !=''){
        //     if(searchTerm.includes("#")){
                
        //         const videosToSend =  videos.filter((video) => {
        //             return video.account.description.includes(searchTerm)
        //         })
        //         videosToSend.sort(function(a,b){
        //             return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
        //            })
        //         setTimeout(()=>{
        //             setVideos([...videosToSend])
        //         },2000)
        //     }
        //     else if(searchTerm.includes("@")){
        //         const videosToSend =  videos.filter((video) => {
        //             return video.account.creatorName.includes(searchTerm.slice(1,searchTerm.length))
        //         })
        //         videosToSend.sort(function(a,b){
        //             return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
        //            })
        //         setTimeout(()=>{
        //             setVideos([...videosToSend])
        //         },2000)
        //     }
        // }else{
        //save all videos in state for frontend 
        // videos = videos.sort()
        console.log("VIDEOOOO ")
       console.log(new Date(videos[0].account.creatorTime))
       videos.sort(function(a,b){
        return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
       })
       setVideos([...videos])
    //    setTimeout(()=>{
    //         
    //     },2000)
       console.log("VIDEOSSSSSSSSSSSSSSSSSSSS")
       console.log(videos)
    //    
    // }
    setIsLoading(false)
    }

    // functionto call likeVideo from smart contract 
    const likeVideo = async (address) => { 
        setIsLoading(true)
        console.log('video Liked !')
        const tx = await program.rpc.likeVideo({
            accounts : {
                video : new PublicKey(address),
                authority : wallet.publicKey,
                ...defaultAccounts,
            },
        })
        console.log(tx)

        setIsLoading(false)
    }

    //function to call getComment from smart contract 
    const createComment = async(address,count,comment) => { 
        setIsLoading(true)
        let [comment_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('comment'),
            new PublicKey(address).toBuffer(),
            new BN(count).toArrayLike(Buffer,'be',8),
        ],
        program.programId,
        )
        if(userDetail){
            const tx = await program.rpc.createComment(
                comment,
                userDetail.userName,
                userDetail.userProfileImageUrl,
                {
                    accounts: {
                        video : new PublicKey(address),
                        comment : comment_pda,
                        authority : wallet.publicKey,
                        ...defaultAccounts,
                    },
                }
            )
            console.log(tx)
        }
        setIsLoading(false)
    }

    // Function to call create video from smart Contract 
    const newVideo = async() => {
        setIsLoading(true)
        //steps to store in ipfs : 
        //1. connect  to web3 storage and ipfs using keys and tokens 
        //const storage = new Web3Storage({ token }) //usage of token 
        //https://web3.storage/docs/#quickstart
        //2. take the input of video as a file from the user  
        //3. upload the video to ipfs and get the cid 
        //4. create a url in the specified format attatching cid + file_name 
        //5. supply this entire url to tht blockchain as video url 
        const randomKey = anchor.web3.Keypair.generate().publicKey;

        let [video_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('video'),randomKey.toBuffer()],
            program.programId,

        )

        const tx = await program.rpc.createVideo(
            description,
            videoUrl,
            userDetail.userName,
            userDetail.userProfileImageUrl,
            {
                accounts : { 
                    video : video_pda,
                    randomkey : randomKey,
                    authority : wallet.publicKey,
                    ...defaultAccounts,
                }
            }
        )
        console.log(tx);
        const sentimentOfDescription = sentiment.analyze(description)
        
        const des = description;
            if(des.includes("#")){
                console.log("inside hashtag ")
                const tagValue = ""
                for(const i=des.indexOf("#");i<des.length;i++){
                    if(des.charAt(i) === ' '){
                        break;
                    }else{
                        tagValue = tagValue + des.charAt(i)
                    }
                }

                const tagString = tagValue.toString();
                console.log(tagString)
                const docRef = await getDoc(doc(db,"hashtags",tagString));
                if(docRef.exists()){
                    console.log("Inside hashtag doc exists ")
                    const data  = docRef.data()
                    await setDoc(doc(db,"hashtags",tagString),{
                        totalVideos : data.totalVideos + 1,
                        videos : arrayUnion(randomKey.toString()),
                        positivity : sentimentOfDescription.score > 0 ? "yes" : "no",
                        negativity : sentimentOfDescription.score < 0 ? "yes" : "no",
                        neutrality : sentimentOfDescription.score === 0 ? "yes" : "no"
                    },{merge : true})
                }else{
                    console.log("Inside hashtag doc not exists ")
                    await setDoc(doc(db,"hashtags",tagString),{
                        totalVideos : 1,
                        totalImages : 0,
                        videos : arrayUnion(randomKey.toString()),
                        images : arrayUnion(""),
                        createdAt : new Date(),
                        positivity : sentiment.score > 0 ? "yes" : "no",
                        negativity : sentiment.score < 0 ? "yes" : "no",
                        neutrality : sentiment.score === 0 ? "yes" : "no"
                    })
                }

            }
        
        setDescription('')
        
        setVideoUrl('')
        setNewVideoShow(false)
        getVideos()
        setIsLoading(false)
       
    }
    //Function to fetch comments fron the commentAccount on the smart contract 
    const getComments = async(address,count) => {
        let commentSigners = [];
        for(let i=0;i<count;i++){
            let [commenSigner] = await  anchor.web3.PublicKey.findProgramAddress(
                [
                    utf8.encode('comment'),
                    new PublicKey(address).toBuffer(),
                    new BN(i).toArrayLike(Buffer,'be',8)
                ],
                program.programId,
            )
            commentSigners.push(commenSigner)
        }
        const comments = await program.account.commentAccount.fetchMultiple(
            commentSigners,
        )
        console.log(comments)
        return comments;
    }

    return {getVideos,likeVideo,createComment,newVideo,getComments}
}

export default useVideos;
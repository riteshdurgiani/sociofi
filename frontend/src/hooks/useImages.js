import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore,addDoc,setDoc,doc,getDoc, arrayUnion, collection ,getDocs} from "firebase/firestore";
import { ReactDOM } from "react";
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

const useImages = (
    setImages,
    userDetail,
    imageUrl,
    description,
    setDescription,
    setImageUrl,
    setNewImageShow,
    isLoading,
    setIsLoading,
    showToast,
    
    setShowToast,
    users,
    topics,
    searchTerm
) => {
    const db = getFirestore(app)
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const program = getProgramInstance(connection,wallet);

    const getImages = async () => { 
        setIsLoading(true)
        const images = await program.account.imageAccount.all();
        //save all videos in state for frontend 
        // videos = videos.sort()
        const dt = {}
       images.forEach(async (image) => {
        const docRef =await getDoc(doc(db,"users",image.account.authority.toString()))
       if(docRef.exists()){
        console.log(dt)
        image.isverified = docRef.data().isverified
        image.hascommunity = docRef.data().hascommunity
       }else{
        image.isverified = "no"
        image.hascommunity = "no"
       }
       
        
       })
        if(searchTerm !=''){
            if(searchTerm.includes("#")){
                
                const imagesToSend =  images.filter((img) => {
                    return img.account.description.includes(searchTerm)
                })
                imagesToSend.sort(function(a,b){
                    return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
                   })
                setTimeout(()=>{
                    setImages([...imagesToSend])
                },2000)
            }
            else if(searchTerm.includes("@")){
                const imagesToSend =  images.filter((img) => {
                    return img.account.creatorName.includes(searchTerm.slice(1,searchTerm.length))
                })
                imagesToSend.sort(function(a,b){
                    return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
                   })
                setTimeout(()=>{
                    setImages([...imagesToSend])
                },2000)
            }
        }else{
        console.log("IMAGEEEEEEEe ")
       console.log(new Date(images[0].account.creatorTime))
       images.sort(function(a,b){
        return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
       })
        setImages([...images])
        console.log(images)
    }
    setIsLoading(false)
    }

    // functionto call likeVideo from smart contract 
    const likeImage = async (address) => { 
        setIsLoading(true)
        console.log('image Liked !')
        const tx = await program.rpc.likeImage({
            accounts : {
                image : new PublicKey(address),
                authority : wallet.publicKey,
                ...defaultAccounts,
            },
        })
        console.log(tx)
        const docRef = doc(db,"users",wallet.publicKey.toString())
        const docSnap = await getDoc(doc)
        const data = docSnap.data()
        const totallks = 0
        if(data.totalLikes){
            totallks = data.totalLikes
        }else{
            totallks = 0
        }
        await setDoc(docRef,{
            totalLikes : totallks + 1
        },{merge : true})
        setIsLoading(false)
    }

    //function to call getComment from smart contract 
    const createCommentImage = async(address,count,comment) => { 
        setIsLoading(true)
        let [commentImage_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('comment'),
            new PublicKey(address).toBuffer(),
            new BN(count).toArrayLike(Buffer,'be',8),
        ],
        program.programId,
        )
        if(userDetail){
            const tx = await program.rpc.createCommentImage(
                comment,
                userDetail.userName,
                userDetail.userProfileImageUrl,
                {
                    accounts: {
                        image : new PublicKey(address),
                        comment : commentImage_pda,
                        authority : wallet.publicKey,
                        ...defaultAccounts,
                    },
                }
            )
            console.log(tx)
        }
        const docRef = doc(db,"users",wallet.publicKey.toString())
        const docSnap = await getDoc(doc)
        const data = docSnap.data()
        const totalComm = 0
        if(data.totalComments){
            totalComm = data.totalComments
        }else{
            totalComm = 0
        }
        await setDoc(docRef,{
            totalComments : totalImgs + 1
        },{merge : true})
        setIsLoading(false)
    }

    // Function to call create video from smart Contract 
    const newImage = async() => {
        //steps to store in ipfs : 
        //1. connect  to web3 storage and ipfs using keys and tokens 
        //const storage = new Web3Storage({ token }) //usage of token 
        //https://web3.storage/docs/#quickstart
        //2. take the input of video as a file from the user  
        //3. upload the video to ipfs and get the cid 
        //4. create a url in the specified format attatching cid + file_name 
        //5. supply this entire url to tht blockchain as video url 
        setIsLoading(true)
        const randomKey = anchor.web3.Keypair.generate().publicKey;

        let [image_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('image'),randomKey.toBuffer()],
            program.programId,

        )

        const tx = await program.rpc.createImage(
            description,
            imageUrl,
            userDetail.userName,
            userDetail.userProfileImageUrl,
            {
                accounts : { 
                    image : image_pda,
                    randomkey : randomKey,
                    authority : wallet.publicKey,
                    ...defaultAccounts,
                }
            }
        )
        const docRef = doc(db,"users",wallet.publicKey.toString())
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        const totalImgs = 0
        if(data.imagesPosted){
            totalImgs = data.imagesPosted
        }else{
            totalImgs = 0
        }
        await setDoc(docRef,{
            imagesPosted : totalImgs + 1
        },{merge : true})
        console.log("TRANSACTIONNNNNNNNNNNNNNNNNNNNNNNNNNN")
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
                        totalImages : data.totalImages + 1,
                        images : arrayUnion(randomKey.toString()),
                        positivity : sentimentOfDescription.score > 0 ? data.positivity + 1 : data.positivity,
                        negativity : sentimentOfDescription.score < 0 ? data.negativity + 1 : data.negativity,
                        neutrality : sentimentOfDescription.score === 0 ? data.neutrality + 1 : data.neutrality
                    },{merge : true})
                }else{
                    console.log("Inside hashtag doc not exists ")
                    await setDoc(doc(db,"hashtags",tagString),{
                        totalVideos : 0,
                        totalImages : 1,
                        images : arrayUnion(randomKey.toString()),
                        videos : arrayUnion(""),
                        createdAt : new Date(),
                        positivity : sentiment.score > 0 ? "yes" : "no",
                        negativity : sentiment.score < 0 ? "yes" : "no",
                        neutrality : sentiment.score === 0 ? "yes" : "no"
                    })
                }

            }
        
        setDescription('')
        setImageUrl('')
        setNewImageShow(false)
        getImages()
        setShowToast('Image Added Successfully')
        setIsLoading(false)
       
        
       

    }
    //Function to fetch comments fron the commentAccount on the smart contract 
    const getImageComments = async(address,count) => {
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
        const comments = await program.account.commentAccountImage.fetchMultiple(
            commentSigners,
        )
        console.log(comments)
        return comments;
    }

    return {getImages,likeImage,createCommentImage,newImage,getImageComments}
}

export default useImages;
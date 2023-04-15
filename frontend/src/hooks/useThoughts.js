import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";

const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const {BN,web3} = anchor
const {SystemProgram} = web3

const defaultAccounts = {
    tokenProgram : TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram : SystemProgram.programId
}

const useThoughts = (
    setThoughts,
    userDetail,
   
    description,
    setDescription,
   
    
) => {
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const program = getProgramInstance(connection,wallet);

    const getThoughts = async () => { 
        const thoughts = await program.account.thoughtAccount.all();
        //save all videos in state for frontend 
        // videos = videos.sort()
        console.log("THOUGHTTTTTTT ")
      
       thoughts.sort(function(a,b){
        return b.account.creatorTime.toNumber() - a.account.creatorTime.toNumber()
       })
        setThoughts(thoughts)
    }

    // functionto call likeVideo from smart contract 
    const likeThought = async (address) => { 
        console.log('thought Liked !')
        const tx = await program.rpc.likeThought({
            accounts : {
                thought : new PublicKey(address),
                authority : wallet.publicKey,
                ...defaultAccounts,
            },
        })
        const docRef = doc(db,"users",wallet.publicKey.toString())
        const docSnap = getDoc(doc)
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
        console.log(tx)
    }

    //function to call getComment from smart contract 
    const createCommentThought = async(address,count,comment) => { 
        let [commentThought_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('thought'),
            new PublicKey(address).toBuffer(),
            new BN(count).toArrayLike(Buffer,'be',8),
        ],
        program.programId,
        )
        if(userDetail){
            const tx = await program.rpc.createCommentThought(
                comment,
                userDetail.userName,
                userDetail.userProfileImageUrl,
                {
                    accounts: {
                        thought : new PublicKey(address),
                        comment : commentThought_pda,
                        authority : wallet.publicKey,
                        ...defaultAccounts,
                    },
                }
            )
            console.log(tx)
            const docRef = doc(db,"users",wallet.publicKey.toString())
            const docSnap = getDoc(doc)
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
        }
    }

    // Function to call create video from smart Contract 
    const newThought = async() => {
        //steps to store in ipfs : 
        //1. connect  to web3 storage and ipfs using keys and tokens 
        //const storage = new Web3Storage({ token }) //usage of token 
        //https://web3.storage/docs/#quickstart
        //2. take the input of video as a file from the user  
        //3. upload the video to ipfs and get the cid 
        //4. create a url in the specified format attatching cid + file_name 
        //5. supply this entire url to tht blockchain as video url 
        const randomKey = anchor.web3.Keypair.generate().publicKey;

        let [thought_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('thought'),randomKey.toBuffer()],
            program.programId,

        )

        const tx = await program.rpc.createThought(
            description,
            
            userDetail.userName,
            userDetail.userProfileImageUrl,
            {
                accounts : { 
                    thought : thought_pda,
                    randomkey : randomKey,
                    authority : wallet.publicKey,
                    ...defaultAccounts,
                }
            }
        )
        console.log(tx);
        const docRef = doc(db,"users",wallet.publicKey.toString())
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        const totalThts = 0
        if(data.thoughtPosted){
            totalThts = data.thoughtsPosted
        }else{
            totalThts = 0
        }
        await setDoc(docRef,{
            thoughtsPosted : totalImgs + 1
        },{merge : true})
        setDescription('')
        
    }
    //Function to fetch comments fron the commentAccount on the smart contract 
    const getThoughtComments = async(address,count) => {
        let commentSigners = [];
        for(let i=0;i<count;i++){
            let [commenSigner] = await  anchor.web3.PublicKey.findProgramAddress(
                [
                    utf8.encode('thought'),
                    new PublicKey(address).toBuffer(),
                    new BN(i).toArrayLike(Buffer,'be',8)
                ],
                program.programId,
            )
            commentSigners.push(commenSigner)
        }
        const comments = await program.account.commentAccountThought.fetchMultiple(
            commentSigners,
        )
        console.log(comments)
        return comments;
    }

    return {getThoughts,likeThought,createCommentThought,newThought,getThoughtComments}
}

export default useThoughts;
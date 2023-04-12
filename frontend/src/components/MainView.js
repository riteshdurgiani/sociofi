import React from "react";
import { Row,Col } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import NavbarApp from "./NavbarApp";
import { Card,Button } from "react-bootstrap";
import PostCard from "./PostCard";
import styles from '../styles/MainView.module.css'
import BottomBar from "./BottomBar";
import NavbarBottom from "./NavbarBottom";
import { useState } from "react";
import { useEffect } from "react";
import UploadModal from "./UploadModal";
import UploadVideoModal from "./UploadVideoModal";
import UploadImageModal from "./UploadImageModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { ListGroup } from "react-bootstrap";
import Badge from "react-bootstrap";
import { BalloonHeartFill, ChatDotsFill, CurrencyDollar, Image } from "react-bootstrap-icons";
import ChannelTile from "./ChannelTile";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import PostCardVideo from "./PostCardVideo";
import SuggestedChannelTile from "./SuggestedChannelTile";
import PostThought from "./PostThought";
import { getProgramInstance } from "../utils/utils";
import useAccount from "../hooks/useAccount";
import Signup from "./Signup";
import useVideos from "../hooks/useVideos";
import LoadingSpinner from "./LoadingSpinner";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import useImages from "../hooks/useImages";
import useThoughts from "../hooks/useThoughts";
import { doc } from "firebase/firestore";
import { getFirestore ,getDoc,getDocs} from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { collection } from "firebase/firestore";
import { query } from "firebase/firestore";
import MyImage from '../images/NotFound.png'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChatModal from "./ChatModal";
const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const {BN,web3} = anchor
const {SystemProgram} = web3 
const db = getFirestore(app)
const defaultAccounts = {
  tokenProgram : TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId
}



let isAccount = false;
const MainView = () => { 
    const [isAccount,setAccount] = useState(false); 
    const [userDetail,setUserDetail] = useState(); 
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);

    const program = getProgramInstance(connection,wallet);

    const [videos,setVideos] = useState([])
    const [images,setImages] = useState([])
    const [thoughts,setThoughts] = useState([])
    const [joinedCommunities,setJoinedCommunities] = useState([])
    const [suggestedCommunities,setSuggestedCommunities] = useState([])
    const [uploadModalShow,setUploadModalShow] = useState(false);
    const [newVideoShow,setNewVideoShow] = useState(false);
    const [newImageShow,setNewImageShow] = useState(false);
    const[description,setDescription] = useState('')
    const [videoUrl,setVideoUrl] = useState('')
    const [imageUrl,setImageUrl] = useState('')
    const [mainViewImageShow,setMainViewImageShow] = useState(true);
    const [mainViewVideoShow,setMainViewVideoShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState('');
    const [chatModalShow,setChatModalShow] = useState(false)
    const [chatAddress,setChatAddress] = useState('')
    const [searchTerm,setSearchTerm] = useState('')
    const [topics,setTopics] = useState([])
    const [users,setUsers] = useState([])
    const {getVideos,likeVideo,createComment,newVideo,getComments} = useVideos(
        setVideos,
        userDetail,
        videoUrl,
        description,
        setDescription,
        setVideoUrl,
        setNewVideoShow,
        isLoading,
        setIsLoading,
        showToast,
        setShowToast,
        users,
        topics,
        searchTerm
      );
      const {getImages,likeImage,createCommentImage,newImage,getImageComments} = useImages(
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
      );
      const {getThoughts,likeThought,createCommentThought,newThought,getThoughtComments} = useThoughts(
        setThoughts,
        userDetail,
        
        description,
        setDescription,
        
      );
      async function setChannel(d){
        const docRef = doc(db, "channels", d.id, d.id + "_channel",  wallet.publicKey.toString());
            const docSnap =  await getDoc(docRef)
            console.log("DOCSNAPPPP")
            console.log(docSnap)
            const newCommArr = [] 
            joinedCommunities.forEach((c) => {
              newCommArr.push(c)
            })
            if(docSnap.exists()){
                console.log("EXISTSSSSSS")
                
                const  newCommunity = {};
                newCommunity.owner = d.data().owner
                newCommunity.profile = d.data().ownerprofile
                newCommunity.address = d.id
      
                newCommArr.push(newCommunity)
                
            }
            joinedCommunities = newCommArr
            setTimeout(()=>{
              setJoinedCommunities([...joinedCommunities])
            },1000)
      
            console.log("COMMUNITIESSSS")
            
       
            console.log(joinedCommunities)
        
      }
      async function getCommunities(){
        const q = query(collection(db, "channels"));
      
        const querySnapshot = await getDocs(q);
        const counter = 0;
        console.log("DOCSSSSs")
        console.log(querySnapshot)
        querySnapshot.forEach((d) => {
         
          setTimeout(()=>{
            setChannel(d)
          },1000)
      
        })
       
        
      }
      async function getSuggestedCommunities(){
        const q = await getDocs(query(collection(db,"channels")))
        const suggestedCommunitiesTemp = []
        q.forEach(async (doc)=>{
          const qInner = await getDocs(query(collection(db,"channels",doc.id,doc.id + "_channel")))
          qInner.forEach((innerDoc) => {
            if(joinedCommunities.includes(innerDoc.id)){
              if(joinedCommunities.includes(doc.id) || suggestedCommunitiesTemp.includes(doc.id)){
               
              }else{
                const newSuggestedComm = {}
                const data = doc.data()
                newSuggestedComm.owner = data.owner
                newSuggestedComm.profile = data.ownerprofile
                newSuggestedComm.address = doc.id


                suggestedCommunitiesTemp.push(newSuggestedComm)
              }
            }
          })
        })
        if(suggestedCommunitiesTemp.length < 3){
          q.forEach((doc) => {
            if(suggestedCommunitiesTemp.includes(doc.id) || joinedCommunities.includes(doc.id)){
              
            }else{
              const newSuggestedComm = {}
                const data = doc.data()
                newSuggestedComm.owner = data.owner
                newSuggestedComm.profile = data.ownerprofile
                newSuggestedComm.address = doc.id
                suggestedCommunitiesTemp.push(newSuggestedComm)
            }
          })
        }
        suggestedCommunities = suggestedCommunitiesTemp;

        setTimeout(()=>{
          setSuggestedCommunities([...suggestedCommunities])
        })
        
      }
      async function getUsersAndTopics(){
        const docRefUsers = await getDocs(collection(db,"users"))
        const docRefTags = await getDocs(collection(db,"hashtags"))
        const tempUsers = []
        const tempTags = []
        docRefUsers.forEach((du) => {
          const data = du.data()
          tempUsers.push("@"+data.username)
        })
        docRefTags.forEach((dtag) => {
          tempTags.push(dtag.id)
        })

        users = tempUsers
        topics = tempTags

        setTimeout(()=>{
          setUsers([...users])
          setTopics([...topics])
        },2000)
        console.log("TOPICSSSSSS AND USERSSSSS")
        console.log(users)
        console.log(topics)
      }

    useEffect(() => {
        if(wallet.connected){
          console.log(wallet)
          checkAccount()
          joinedCommunities = []
            setJoinedCommunities([])
            suggestedCommunities = []
            setSuggestedCommunities([])
          console.log(videos)
          getVideos()
          getImages()
          getThoughts()
          getCommunities()
          getUsersAndTopics()
          getSuggestedCommunities()
        }
      },[wallet.publicKey])
     useEffect(()=>{
      console.log("changeddd video ")
      setIsLoading(true)
      getImages()
      getVideos()
      setIsLoading(false)
     },[mainViewImageShow,mainViewVideoShow])
      const checkAccount = async () => {
        setIsLoading(true)
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
          [utf8.encode('user'),wallet.publicKey.toBuffer()],
          program.programId,
        
        )
    
        try{
          const userInfo = await program.account.userAccount.fetch(user_pda);
          console.log(userInfo);
          setUserDetail(userInfo);
          setAccount(true);
        }catch(e){
         setAccount(false) 
        }
        setIsLoading(false)
      }
      useEffect(()=>{
        console.log("SEARCH TERM CHANGEDDDDDDDDDDD")
        setImages([])
        getImages()
        setVideos([])
        getVideos()
      },[searchTerm])
      
      const {signup} = useAccount()
    return (
        <>
        {isAccount ? (
            <div style={{width:'100%',background:'#020102'}}>
             

            <NavbarApp
                userDetail = {userDetail}
                mainViewImageShow = {mainViewImageShow}
                mainViewVideoShow = {mainViewVideoShow}
                setMainViewImageShow = {setMainViewImageShow}
                setMainViewVideoShow = {setMainViewVideoShow}
                joinedCommunities = {joinedCommunities}
                setJoinedCommunities = {setJoinedCommunities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                searchTerm = {searchTerm}
                setSearchTerm = {setSearchTerm}
                users = {users}
                topics = {topics}
            />
            <NavbarBottom 
            setUploadModalShow = {setUploadModalShow}
            />
              {isLoading ? <LoadingSpinner /> : ""}
            {uploadModalShow && (
                  <UploadModal
                  
                  setUploadModalShow = {setUploadModalShow}
                  setNewVideoShow = {setNewVideoShow}
                  setNewImageShow = {setNewImageShow}
                  />
                )}
            {
              chatModalShow && (
                <ChatModal
                userAddress = {wallet.publicKey.toString()}
                chatAddress = {chatAddress}
                chatModalShow = {chatModalShow}
                setChatModalShow = {setChatModalShow}
                isLoading = {isLoading}
                setIsLoading = {setIsLoading}
                />
              )
            }
            {newVideoShow && (
                  <UploadVideoModal

                  description = {description}
                  videoUrl = {videoUrl}
                    newVideo = {newVideo}
                  setDescription = {setDescription}
                  setVideoUrl = {setVideoUrl}
                  setNewVideoShow = {setNewVideoShow}
                  isLoading = {isLoading}
                  setIsLoading = {setIsLoading}
                  />
                )}
            {newImageShow && (
                  <UploadImageModal
                  description = {description}
                  imageUrl = {imageUrl}
                    newImage = {newImage}
                  setDescription = {setDescription}
                  setImageUrl = {setImageUrl}
                  setNewImageShow = {setNewImageShow}
                  isLoading = {isLoading}
                  setIsLoading = {setIsLoading}
                  />
                )}
            <div style={{background:'#020102'}}>
                <Row className="ml-10px">
                    <Col className={styles.show}  lg="3" style={{
                        borderRight:'0.1px solid #241B35 '
                        }}>
                        <Row>
                            <Col sm="1" xs="1" md="1" lg="1"></Col>
                            <Col sm="10" xs="10" md="10" lg="10">
                            <div className={styles.leftDiv}>
                                <center>
                                <h4 style={{
                                    color : 'white',marginTop : '10px',padding : '10px'
                                }}>Subscribed Channels</h4>
                                </center>
                               
                               
                                <>
                               {joinedCommunities.length == 0 ? (
                                <div style={{paddingBottom : "10px", display : "flex" , flexDirection : "column", alignItems : "center" , marginBottom : "40%"}}>
                                  <img src="/page-not-found-4.png"></img>
                                <p style={{color : "white"}}> <b>OOPS!</b> No Channels Subscribed yet </p>
                                
                                </div>
                                ): (
                               
                              
                              
                                    joinedCommunities.map((jc,id)=>(
                                        <ChannelTile
                                        key={id}
                                        channel = {jc.owner}
                                        profile = {jc.profile}
                                        address = {jc.address}
                                        chatModalShow = {chatModalShow}
                                        setChatModalShow = {setChatModalShow}
                                        chatAddress = {chatAddress}
                                        setChatAddress = {setChatAddress}
                                        />
                                    ))
                                    // joinedCommunities.map((jc) => {
                                    //     <ChannelTile
                                    //     channel = {jc.owner}
                                    //     profile = {jc.profile}
                                    //     address = {jc.address}
                                    //     />
                                    // })
                               )}
                               
                                    </>
                               
                            </div>
                            </Col>
                            <Col sm="1" xs="1" md="1" lg="1"></Col>
                        </Row>
                        <Row style={{marginTop : "-10%"}}>
                            <Col sm="1" xs="1" md="1" lg="1"></Col>
                            <Col sm="10" xs="10" md="10" lg="10">
                            <div className={styles.leftDiv}>
                                <center>
                                <h4 style={{
                                    color : 'white',marginTop : '10px',padding : '10px'
                                }}>Suggested Channels</h4>
                                </center>
                               
                                <>
                               {suggestedCommunities.length == 0 ? (
                                <div style={{paddingBottom : "10px", display : "flex" , flexDirection : "column", alignItems : "center" , marginBottom : "40%"}}>
                                  <img src="/page-not-found-4.png"></img>
                                <p style={{color : "white"}}> <b>OOPS!</b> No Channels Subscribed yet </p>
                                
                                </div>
                                ): (
                               
                              
                              
                                    suggestedCommunities.map((jc,id)=>(
                                        <SuggestedChannelTile
                                        key={id}
                                        channel = {jc.owner}
                                        profile = {jc.profile}
                                        address = {jc.address}
                                        chatModalShow = {chatModalShow}
                                        setChatModalShow = {setChatModalShow}
                                        chatAddress = {chatAddress}
                                        setChatAddress = {setChatAddress}
                                        userDetail = {userDetail}
                                        />
                                    ))
                                    // joinedCommunities.map((jc) => {
                                    //     <ChannelTile
                                    //     channel = {jc.owner}
                                    //     profile = {jc.profile}
                                    //     address = {jc.address}
                                    //     />
                                    // })
                               )}
                               
                                    </>
                            </div>
                            </Col>
                            <Col sm="1" xs="1" md="1" lg="1"></Col>
                        </Row>
                       
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="5">
                    <Row style={{backgroundColor: 'black'}}>
                        <Col sm="2" xs="2" md="2" lg="2" className={styles.bgClass}></Col>
                        <Col sm="8" xs="8" md="8" lg="8" className="d-flex flex-column flex-nowrap " 
                        style={{
                          
                            padding : 0,
                            backgroundColor : 'black',
                            marginTop:'-10px'
                        }}
                        >
                            

                            <>
                                {mainViewImageShow ? (
                                   <div style={{height : '100%'}}>
                                       {images.length === 0? (
                                        <div style={{paddingBottom : "10px", display : "flex" , flexDirection : "column", alignItems : "center" , marginBottom : "40%"}}>
                                        <img src="/page-not-found-4.png"></img>
                                      <p style={{color : "white"}}> <b>OOPS!</b> No Images to show </p>
                                      
                                      </div>
                                       ) : (
                                        images.map((image,id) => (
                                            <PostCard
                                                key = {id}
                                                address = {image.publicKey.toBase58()}
                                                url = {image.account.imageUrl}
                                                channel = {image.account.creatorName}
                                                index = {image.account.index.toNumber()}
                                                likes = {image.account.likes}
                                                description = {image.account.description}
                                                likeImage = {likeImage}
                                                likesAddress = {image.account.peopleWhoLiked}
                                                createCommentImage = {createCommentImage}
                                                getImageComments = {getImageComments}
                                                commentCountImage = {image.account.commentCount.toNumber()}
                                                connection = {connection}
                                                image = {image}
                                                userDetail = {userDetail}
                                                
                                            />

                                        ))
                                       )}
                                        <div style={{width:'match-parent',height:'80px'}}></div>
                                    
                                        </div>
                                ) : (
                                    <div style={{height : '100%'}}>
                                        
                                        {videos.length === 0 ? (
                                            <div style={{paddingBottom : "10px", display : "flex" , flexDirection : "column", alignItems : "center" , marginBottom : "40%"}}>
                                            <img src="/page-not-found-4.png"></img>
                                          <p style={{color : "white"}}> <b>OOPS!</b> No videos to show </p>
                                          
                                          </div>
                                        ) : (
                                            videos.map((video,id)=>(
                                                <PostCardVideo
                                                key = {id}
                                                address = {video.publicKey.toBase58()}
                                                url = {video.account.videoUrl}
                                                channel = {video.account.creatorName}
                                                index = {video.account.index.toNumber()}
                                                likes = {video.account.likes}
                                                description = {video.account.description}
                                                likeVideo = {likeVideo}
                                                likesAddress = {video.account.peopleWhoLiked}
                                                createComment = {createComment}
                                                getComments = {getComments}
                                                commentCount = {video.account.commentCount.toNumber()}
                                                connection = {connection}
                                                video = {video}
                                                userDetail = {userDetail}
                                                />
                                            ))
                                        )}
                                
                                 <div style={{width:'match-parent',height:'80px'}}></div>
                                    </div>
                                )}
                            </>
                                {/* {mainViewImageShow  ? () : ()} */}
                            
                               
                            
                        </Col>
                        <Col sm="2" xs="2" md="2" lg="2" className={styles.bgClass}></Col>
                    </Row>
                    
                    </Col>
                    <Col className={styles.show} xs="0" sm="0" md="0" lg="4" style={{borderLeft:'0.1px solid #241B35 '}}>
                        <PostThought
                            thoughts = {thoughts}
                            description = {description}
                            likeThought = {likeThought}
                            createCommentThought = {createCommentThought}
                            newThought = {newThought}
                            getThoughtComments = {getThoughtComments}
                            setDescription = {setDescription}
                            connection = {connection}
                        />
                    </Col>
                </Row>
                </div>
        
               
            </div>

        ) : (
            <Signup signup = {signup} wallet = {wallet.publicKey.toBase58} isLoading={isLoading} setIsLoading={setIsLoading}
            isAccount = {isAccount} setAccount={setAccount}
            />
        )}
        </>
    )
    
}
{/* <div className={styles.show} >
<div className="card card-block mx-2 " style={{marginTop:'30px',marginLeft:'60px'}}>
        <Card style={{ width: "match-parent",padding: '20px',background:'#020102',
            border:'none', boxShadow: '5px 5px 10px 5px #6443a6bd'
    }}>
        <Card.Title style={{color:'white'}}>@Rdurgiani</Card.Title>
            <Card.Img variant="top" src="https://res.cloudinary.com/ddvq2mc2b/image/upload/v1674993692/cld-sample.jpg" 
            style={{
                border : "1px solid black",
                height : 'fit-parent',
                width : 'fit-parent',
                
            }}
            />
            <Card.Body style={{display:'flex',flexDirection:'column',color:'white'}}>
            <div style={{display : 'flex',justifyContent:'space-between'}}>

                        <BalloonHeartFill
                        size='20px'
                        />
                        <ChatDotsFill
                         size='20px'
                        />
                        <CurrencyDollar
                         size='20px'
                        />
                        <div> <Button variant="primary">join</Button></div>
                        </div>
                <div style={{display : 'flex'}}>
                    
                <Card.Title>Rdurgiani</Card.Title>
                <Card.Text>
                    Demo picture
                </Card.Text>
                </div>
                
                
            </Card.Body>
        </Card>
    </div>
    </div> */}
export default MainView;

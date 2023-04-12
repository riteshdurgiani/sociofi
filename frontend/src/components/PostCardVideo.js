import React from "react";
import styles from '../styles/PostCard.module.css'
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Comments from "./Comments";
import { useState } from "react";
import { useRef } from "react";
const PostCardVideo = ({
    address,
    url,
    channel,
    description,
    index,
    likes,
    shares,
    likeVideo,
    likesAddress,
    createComment,
    getComments,
    commentCount,
    connection,
    video,
    userDetail
}) => {
    const videoRef = useRef(null)

    const [showCommentsModal,setShowCommentsModal] = useState(false);
    const hideComments = () => { 
        setShowCommentsModal(false);
    }
    const showComments = () => { 
        setShowCommentsModal(true);

    }
    const onVideoPress = () => {
        videoRef.current.play()
    }
    return(
        <div style={{minWidth:'500px',height:'500px',border:'none',marginTop:'30px'}}>
        <div className={styles.wrapper}>
        <video
        crossOrigin="Anonymous"
        width=  "100% !important"
        height=  "auto !important"
        loop
        src = {url}
        className={styles.imageFrame}
        ref = {videoRef}
        onClick = {onVideoPress}
        style = {{objectFit:'cover'}}
        />
        <Footer
        address = {address}
        userDetail = {userDetail}
        channel = {channel}
        description = {description}
        song = {index}
        video = {video}
        
        />
        <Sidebar
        address = {address}
        likes = {likes}
        shares = {shares}
        onShowComments = {showComments}
        likeVideo = {likeVideo}
        index = {index}
        likesAddress = {likesAddress}
        messages = {commentCount}
        connection = {connection}
        video = {video}
        />
        {showCommentsModal && (
            <Comments
            onHide = {hideComments}
            index = { index}
            address = {address}
            createComment = {createComment}
            getComments = {getComments}
            commentCount = {commentCount}
            /> 
        )}
    </div>
    </div>
    )
}

export default PostCardVideo;
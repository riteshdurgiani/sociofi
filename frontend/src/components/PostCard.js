import React from "react";
import styles from '../styles/PostCard.module.css'
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Comments from "./Comments";
import { useState } from "react";
import CommentsImage from "./CommentsImage";
const PostCard = ({
    address,
    url,
    channel,
    description,
    index,
    likes,
    shares,
    likeImage,
    likesAddress,
    createCommentImage,
    getImageComments,
    commentCountImage,
    connection,
    image,
    userDetail
   
}) => {
    const [showCommentsModal,setShowCommentsModal] = useState(false);
    const hideComments = () => { 
        setShowCommentsModal(false);
    }
    const showComments = () => { 
        setShowCommentsModal(true);

    }

    return(
        <div   style={{minWidth:'500px',height:'500px',border:'none',marginTop:'30px'}}>
        <div className={styles.wrapper}>
        <img
        crossOrigin="Anonymous"
        src = {url}
        className={styles.imageFrame}
        
        style = {{objectFit:'cover'}}
        />
        <Footer
        address = {address}
        userDetail = {userDetail}
        channel = {channel}
        description = {description}
        song = {index}
        video = {image}
       
        />
        <Sidebar
        address = {address}
        likes = {likes}
        shares = {shares}
        onShowComments = {showComments}
        likeVideo = {likeImage}
        index = {index}
        likesAddress = {likesAddress}
        messages = {commentCountImage}
        connection = {connection}
        video = {image}
       
        />
        {showCommentsModal && (
            <CommentsImage
            onHide = {hideComments}
            index = { index}
            address = {address}
            createCommentImage = {createCommentImage}
            getImageComments = {getImageComments}
            commentCountImage = {commentCountImage}
            /> 
        )}
    </div>
    </div>
    )
}

export default PostCard;
import React,{useState,useEffect} from "react";
import styles from '../styles/CommentsImage.module.css'
import CommentCard from "./CommentCard";
const CommentsImage = ({
    address,
    onHide,
    createCommentImage,
    index,
    getImageComments,
    commentCountImage,
}) => { 

    const[commentsImage,setCommentsImage] = useState([]);
    const [newCommentImage,setNewCommentImage] = useState('')
    useEffect(()=>{
        gettingComments()
    },[index])
    const gettingComments = async () =>{
        let comments = await getImageComments(address,commentCountImage);
        comments.sort((a,b)=> b.imageTime.toNumber() - a.imageTime.toNumber())
        setCommentsImage(comments)
    }
    const replyClicked = async () =>{
        await createCommentImage(address,commentCountImage,newCommentImage)
        setNewCommentImage('')
    }
    return (
        <div className={styles.wrapper}> 
            <div className={styles.commentsHeader}>
                <p>{commentCountImage} comments</p>
                <p className={styles.closeButton} onClick={onHide}>
                    &times;
                </p>
            </div>
            {commentsImage.map(comment => {
                return (
                    <CommentCard
                    key = {comment.index.toNumber()}
                    username = {comment.commenterName}
                    comment = {comment.text}
                    avatar = {comment.commenterUrl}
                    timestamp = {comment.videoTime ? comment.videoTime.toNumber() : comment.imageTime.toNumber()}
                    />
                )
            })}
            <div className={styles.commentInputWrapper}>
                <input
                type='text'
                
                onChange={e => setNewCommentImage(e.target.value)}
                value = {newCommentImage}
                placeholder = 'leave a comment...'
                />
                <button className={styles.button}
                onClick = {replyClicked}
                >Reply </button>
            </div>
        </div>
    )
}
export default CommentsImage;
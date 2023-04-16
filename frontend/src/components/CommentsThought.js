import React,{useState,useEffect} from "react";
import styles from '../styles/CommentsImage.module.css'
import CommentCard from "./CommentCard";
const CommentsThought = ({
    address,
    setShowThoughtCommentsModal,
    createCommentThought,
    index,
    getThoughtComments,
    commentCountThought,
}) => { 

    const[commentsThought,setCommentsThought] = useState([]);
    const [newCommentThought,setNewCommentThought] = useState('')
    useEffect(()=>{
        gettingComments()
    },[index])
    const gettingComments = async () =>{
        let comments = await getThoughtComments(address,commentCountThought);
        comments.sort((a,b)=> b.thoughtTime.toNumber() - a.thoughtTime.toNumber())
        setCommentsThought(comments)
    }
    const replyClicked = async () =>{
        await createCommentThought(address,commentCountThought,newCommentThought)
        setNewCommentThought('')
    }
    return (
        <div className={styles.wrapper}> 
            <div className={styles.commentsHeader}>
                <p>{commentCountThought} comments</p>
                <p className={styles.closeButton} onClick={() => {setShowThoughtCommentsModal(false)}}>
                    &times;
                </p>
            </div>
            <div>
            {commentsThought.map(comment => {
                return (
                    <CommentCard
                    
                    key = {comment.index.toNumber()}
                   
                    username = {comment.commenterName}
                    comment = {comment.text}
                    avatar = {comment.commenterUrl}
                    timestamp = {comment.thoughtTime}
                    />
                )
            })}
            </div>
            <div className={styles.commentInputWrapper}>
                <input
                type='text'
                
                onChange={e => setNewCommentThought(e.target.value)}
                value = {newCommentThought}
                placeholder = 'leave a comment...'
                />
                <button className={styles.button}
                onClick = {replyClicked}
                >Reply </button>
            </div>
        </div>
    )
}
export default CommentsThought;
import React from "react";
import { Card } from "react-bootstrap";
import styles from '../styles/PostThought.module.css'
import ThoughtTile from "./ThoughtTile";
import { useState } from "react";
import CommentsThought from "./CommentsThought";
import { API_NINJAS_API_KEY } from "../utils/const";


const PostThought = (
    {
        thoughts,
        description,
        likeThought,
        createCommentThought,
        newThought,
        
        getThoughtComments,
        setDescription,
        connection
    }
) => {
    const [keywordsInput,showKeywordsInput] = useState(false)
    const [category,setCateogory] = useState('')
    async function setThought() {
        
       
        fetch("https://api.api-ninjas.com/v1/quotes?category=" + category, {
            method: "GET",
            headers: {
                'X-Api-Key': 'LHHMvBRDtAe3ZdRN/z0Wkg==nnUSkNM4GYIBq8rO'
              },
           
          })
            .then((response) => response.json())
            .then((data) => {
            document.getElementById('thoughtIp').value = data[0].quote
              setDescription(data[0].quote)
              console.log(data);
            })
            .catch((error) => console.log(error));
        
    }
    return(
        <div>
        <Card className = {styles.wrapper}>
            <Card.Header className={styles.inputTitleHead}>Post a Thought </Card.Header>
            <Card.Body>
               

                    <div className={styles.inputTitle}>What's on your mind ? </div>
                    <div className={styles.inputContainer}>
                        <input
                        id = 'thoughtIp'
                        className={styles.input}
                        type = 'text'
                        value = {description}
                        onChange = {(e=>setDescription(e.target.value))}
                        />
                    </div>
                    {keywordsInput ?  <div className={styles.inputContainer}>
                        <input
                        className={styles.input}
                        type = 'text'
                        value = {category}
                        onChange = {(e=>setCateogory(e.target.value))}
                        />
                        <button 
                        onClick = {setThought}
                        className = {`${styles.button} ${styles.createButton}`}
                        >
                            Generate 
                        </button>
                    </div> : ""}
                    <div style={{display : 'flex' , justifyContent : 'space-between'}}>
                <button 
                onClick = {newThought}
                className = {`${styles.button} ${styles.createButton}`}
                >
                    Post 
                </button>
                <button 
                onClick = {() => {showKeywordsInput(true)}}
                className = {`${styles.button} ${styles.createButton}`}
                >
                    Generate 
                </button>
                </div>
            </Card.Body>
            {thoughts.length === 0 ? (
                <div style={{paddingBottom : "10px", display : "flex" , flexDirection : "column", alignItems : "center" , marginBottom : "40%"}}>
                <img src="/page-not-found-4.png"></img>
              <p style={{color : "white"}}> <b>OOPS!</b> No thoughts to show </p>
              
              </div>
            ) : (
                thoughts.map((thought,id)=>(
                    <ThoughtTile
                    key = {id}
                    address = {thought.publicKey.toBase58()}
                    
                    channel = {thought.account.creatorName}
                    index = {thought.account.index.toNumber()}
                    likes = {thought.account.likes}
                    description = {thought.account.description}
                    likeThought = {likeThought}
                    likesAddress = {thought.account.peopleWhoLiked}
                    createCommentThought = {createCommentThought}
                    getThoughtComments = {getThoughtComments}
                    commentCountThought = {thought.account.commentCount.toNumber()}
                    connection = {connection}
                    thought = {thought}
                 
                    />
                ))
            )}
                    
            
        </Card>
        
        </div>
    )
}

export default PostThought
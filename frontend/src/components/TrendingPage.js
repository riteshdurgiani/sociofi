import React, { useEffect, useState } from "react";
import styles from "../styles/TrendingPage.module.css"
import { collection, getFirestore, orderBy,getDocs } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { query } from "firebase/firestore";
import { Card } from "react-bootstrap";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

const timeAgo= new TimeAgo('en-US')

const TrendingPage = ({
    trendingMainView,
    setTrendingMainView
}) =>{
    const db = getFirestore(app)
    const [showTrending,setShowTrending] = useState(false)
    const [topics,setTopics] = useState([])
    const [trendingTopics,setTrendingTopics] = useState([])
    async function getTopics(){
        const docRef = query(collection(db,"hashtags"))
        const  tags = await getDocs(docRef)
        const topicsTemp = []
        tags.forEach((tag)=>{
            const tagToAdd = tag.data()
            tagToAdd.topicName = tag.id
            topicsTemp.push(tagToAdd)
        })

        topics = topicsTemp
        topics.sort(function(a,b){
            return Number(b.createdAt) - Number(a.createdAt)
        })
        setTimeout(()=>{
            setTopics([...topics])
        },2000)
         const count = 0;
         const trendingTopicsTemp = []
         topics.forEach((topic) => {
            if(count < 4){
                trendingTopicsTemp.push(topic)
            }
            count = count+1
         })
        trendingTopics = trendingTopicsTemp
         setTimeout(()=>{
            setTrendingTopics([...trendingTopics])
         },2000)
    }
    useEffect(()=>{
        setTopics([])
       getTopics()
    },[trendingMainView,setShowTrending])
    
    return(
       <div>
            <div  style={{display : "flex" , flexDirection : "row" ,marginTop : "40px", justifyContent : "center"}}>
                <button className={styles.button} onClick={()=>{
                    console.log(showTrending)
                    setShowTrending(true)
                    showTrending
                }}>
                    Trending Topics
                </button>
                <button className={styles.button} onClick={()=>{
                    setShowTrending(false)
                }}>
                    All Topics 
                </button>
           </div>
           <div >
            <>
              {showTrending ? (
                <div>
                {trendingTopics.map((topic,index) => (
                    <Card key={index} className={styles.wrapper}>
                        <Card.Header>{topic.topicName}</Card.Header>
                        <Card.Body>
                            <div style={{display : "flex" , flexDirection : "column"}}>
                                <p>Images : {topic.totalImages}</p>
                                <p>Videos : {topic.totalVideos}</p>
                                <p>Positive : {topic.positivity}</p>
                                <p>Neagtive : {topic.negativity}</p>
                                <p>Neutral  : {topic.neutrality}</p>
                            </div>
                        </Card.Body>
                        <Card.Footer>Topic Started At : {new Date(topic.createdAt.seconds * 1000).toDateString()}</Card.Footer>
                    </Card>
                ))}
                </div>
              ) : (
                <div>
                {topics.map((topic,index) => (
                    <Card key={index} className={styles.wrapper}>
                        <Card.Header>{topic.topicName}</Card.Header>
                        <Card.Body>
                            <div style={{display : "flex" , flexDirection : "column",maxHeight : "fit-content"}}>
                                <p>Images : {topic.totalImages}</p>
                                <p>Videos : {topic.totalVideos}</p>
                                <p>Positive : {topic.positivity}</p>
                                <p>Neagtive : {topic.negativity}</p>
                                <p>Neutral  : {topic.neutrality}</p>
                            </div>
                          
                        </Card.Body>
                        <Card.Footer>Topic Started At : {new Date(topic.createdAt.seconds * 1000).toDateString()}</Card.Footer>
                        
                    </Card>
                    
                ))}
                </div>
              )}
            </>
                <div style={{height : "60px"}}></div>
            </div>
       </div>
    )
}

export default TrendingPage
import React, { useEffect, useState } from "react";
import styles from "../styles/TrendingPage.module.css"
import { collection, getFirestore, orderBy,getDocs } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
import { query } from "firebase/firestore";
import { Card } from "react-bootstrap";
const TrendingPage = ({
    trendingMainView,
    setTrendingMainView
}) =>{
    const db = getFirestore(app)

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
         topics.forEach((topic) => {
            if(count < 4){
                trendingTopics.push(topic)
            }
         })

         setTimeout(()=>{
            setTrendingTopics([...trendingTopics])
         })
    }
    useEffect(()=>{
        setTopics([])
       getTopics()
    },[trendingMainView])
    
    return(
       <div>
            <div style={{display : "flex" , flexDirection : "row"}}>
                <button onClick={()=>{}}>
                    Trending Topics
                </button>
                <button onClick={()=>{}}>
                    All Topics 
                </button>
           </div>
           <div>
                {topics.map((topic,index) => (
                    <Card key={index}>
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
                        <Card.Footer>Topic Started At : </Card.Footer>
                    </Card>
                ))}
            </div>
       </div>
    )
}

export default TrendingPage
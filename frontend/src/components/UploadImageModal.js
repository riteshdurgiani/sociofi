import React, { useState } from "react";
import styles from '../styles/UploadVideoModal.module.css'
import { Web3Storage } from "web3.storage";
import { getFilesFromPath } from 'web3.storage';
import LoadingSpinner from "./LoadingSpinner";
import { collection ,getDoc,doc, getFirestore,setDoc, arrayUnion } from "firebase/firestore";
import app from "../firebaseUtils/fbConfig";
const UploadImageModal = ({
    description,
    imageUrl,
    newImage,
    setDescription,
    setImageUrl,
    setNewImageShow,
    isLoading,
    setIsLoading
}) => {
    const db = getFirestore(app)
    const [imageKeyWordsInput,setImageKeywordsInput] = useState(false)
    const [imageKeywords,setImageKeyWords] = useState('')
    const [generatedImage,setGeneratedImage] = useState()
    const [showImageDiv,setShowImageDiv] = useState(false)
    function jsonFile(filename, obj) {
        return new File([JSON.stringify(obj)], filename)
      }
      const namePrefix = "ImageGallery"
    async function selectedFile(){
        setIsLoading(true)
        
        const metadataFile = jsonFile('metadata.json', {
            path:  document.getElementById("fileob").files[0].filename
            
          })
          const uploadName = namePrefix 
          const web3storage = new Web3Storage({token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY5MzQ2NUZhZDEzMGNDMEJCODA2ODVBRUJkRDU1MTQ2MDI1MjNjNjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzYyNzQwNDg3OTksIm5hbWUiOiJzb2Npb2ZpIn0.OBrPGBVfW6qJYczug5ZsimcibJGOb3pXNSq0mRYCD6Y'})
          const selectedFile = document.getElementById("fileob").files[0]
          const cid = await web3storage.put([selectedFile, metadataFile], {
            // the name is viewable at https://web3.storage/files and is included in the status and list API responses
            name: uploadName,
        
            // onRootCidReady will be called as soon as we've calculated the Content ID locally, before uploading
            
          })
          console.log(cid)
          console.log(selectedFile)
          const imageURI = `https://${cid}.ipfs.w3s.link/${encodeURIComponent(selectedFile.name)}`
          console.log(imageURI)
          setImageUrl(imageURI)
        
          setIsLoading(false)
        }
        async function setImage(){
            setShowImageDiv(true)
            setIsLoading(true)
            const input = imageKeywords
            const response = await fetch(
              "https://api-inference.huggingface.co/models/prompthero/openjourney",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer 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`,
                },
                body: JSON.stringify({ inputs: input }),
              }
            );
        
            if (!response.ok) {
              setIsLoading(false)
                console.log(response)
              alert("Ooops ! Try Some Other Keyword")
            }
        
            const blob = await response.blob();
            console.log(blob)
            generatedImage = blob
            setGeneratedImage(generatedImage)
            document.getElementById("generatedImg").src = URL.createObjectURL(blob)
            setIsLoading(false)
           
            // setOutput(URL.createObjectURL(blob));
        }
        async function saveFileToIpfs(){
            setIsLoading(true)
            const web3storage = new Web3Storage({token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY5MzQ2NUZhZDEzMGNDMEJCODA2ODVBRUJkRDU1MTQ2MDI1MjNjNjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzYyNzQwNDg3OTksIm5hbWUiOiJzb2Npb2ZpIn0.OBrPGBVfW6qJYczug5ZsimcibJGOb3pXNSq0mRYCD6Y'})
            console.log("BLOBBBB")
            console.log(generatedImage)
            const selectedFile = new File([generatedImage],imageKeywords)
            console.log("GENERATED FILEEEEEEEEEEe")
            console.log(selectedFile)
            const cid = await web3storage.put([selectedFile],{
                name : namePrefix + "Generated"
            })
            console.log(cid)
            const imageURI = `https://${cid}.ipfs.w3s.link/${encodeURIComponent(selectedFile.name)}`
            console.log(imageURI)
            setImageUrl(imageURI)
            setIsLoading(false)

        }
        
    return(
        <div className ={styles.wrapper}>
            {isLoading ? <LoadingSpinner /> : ""}
            <div className={styles.title}>Upload New Image </div>
            <div className={styles.inputField}>
                <div className={styles.inputTitle}>Description</div>
                <div className={styles.inputContainer}>
                    <input
                    className={styles.input}
                    type = 'text'
                    value = {description}
                    onChange = {e=>setDescription(e.target.value)}
                    />
                </div>
            </div>
            {!imageKeyWordsInput ? < div className={styles.inputField}>
                <div className={styles.inputTitle}>Image Url</div>
                <div className={styles.inputContainer}>
                <input
                    id="fileob"
                    // onPaste={e => {
                    //     selectedFile(e.target.value)
                    // }}
                    className={styles.input}
                    type = 'file'
                    //value = {videoUrl}
                    onChange = {selectedFile}
                    />
                </div>
            </div> : ''}
            
            {imageKeyWordsInput ?  <div className={styles.inputContainer}>
                        <input
                        className={styles.input}
                        type = 'text'
                        value = {imageKeywords}
                        onChange = {(e=>setImageKeyWords(e.target.value))}
                        />
                        <button 
                        onClick = {()=>{
                            
                            setImage()
                        }}
                        className = {`${styles.button} ${styles.createButton}`}
                        >
                            Generate 
                        </button>
                    </div> : ""}
                    {imageKeyWordsInput && showImageDiv ? <div style={{display :"flex" , flexDirection : "column"}}>
                        <img id="generatedImg" height="300px" width="300px"></img>
                        <button 
                            onClick={()=>{
                                saveFileToIpfs()
                            }}
                            className = {`${styles.button} ${styles.createButton}`}
                            >
                                Approve Image   
                            </button>
                        </div> : ''}
            <button 
                onClick={()=>{
                    setImageKeywordsInput(true)
                }}
                className = {`${styles.button} ${styles.cancelButton}`}
                >
                    Generate
                </button>
            <div className={styles.modalButtons}>
                <button 
                onClick={()=>{
                    setDescription('');
                    setImageUrl('');
                    setImageKeyWords(false)
                    setGeneratedImage('')
                    setImageKeywordsInput(false)
                    setNewImageShow(false)
                }}
                className = {`${styles.button} ${styles.cancelButton}`}
                >
                    Cancel 
                </button>
                <button 
                onClick={newImage}
                className = {`${styles.button} ${styles.createButton}`}
                >
                    Create  
                </button>
            </div>
        </div>
    )
}

export default UploadImageModal;
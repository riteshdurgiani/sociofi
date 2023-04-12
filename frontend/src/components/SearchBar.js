import React from "react";
import styles from "../styles/SearchBar.module.css"
import { useState } from "react";
import { Search, XCircleFill } from "react-bootstrap-icons";
const SearchBar = ({ placeholder, data ,searchTerm,setSearchTerm}) => {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    
    const handleFilter = (event) => {
        console.log("SEARCHHHHH BARRRRRR")
        console.log(data)
        document.getElementById("ss").style.visibility = "visible"
      const searchWord = event.target.value;
      setWordEntered(searchWord);
      const newFilter = data.filter((value) => {
        return value.toLowerCase().includes(searchWord.toLowerCase());
      });
  
      if (searchWord === "") {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    };
  
    const clearInput = () => {
      setFilteredData([]);
      setWordEntered("");
      setSearchTerm('')
    };
  
    return (
      <div className={styles.search}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            id="ii"
            className={styles.inputField}
            placeholder={placeholder}
            value={wordEntered}
            onChange={handleFilter}
          />
          
            {filteredData.length === 0 ? (
              <Search style={{marginLeft : "5px"}}height="30px" width="30px" color="white"
              onClick={()=>{
                setSearchTerm(wordEntered)
              }}
              />
            ) : (
              <XCircleFill height="20px" width="20px" color="red" id="clearBtn" onClick={clearInput} />
            )}
         
        </div>
       <div id = "ss" visibility ="hidden">
       {filteredData.length != 0 && (
          <div className={styles.dataResult}>
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <a onClick={()=>{
                    document.getElementById("ii").textContent = value
                    document.getElementById("ss").style.visibility = "hidden"
                    
                    setSearchTerm(value)
                }}key={key} id={key} className={styles.dataItem}  target="_blank">
                  <p >{value} </p>
                </a>
              );
            })}
          </div>
        )}
       </div>
      </div>
    );
  }
  
  export default SearchBar;
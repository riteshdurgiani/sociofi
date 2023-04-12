import React from "react";
import { Navbar } from "react-bootstrap";
import { PlusCircleFill, PlusSquareFill } from "react-bootstrap-icons";
import styles from '../styles/NavbarBottom.module.css'
const NavbarBottom = ({
    setUploadModalShow
}) => { 

    return(
        <Navbar className={styles.wrapper} expand="lg" variant="dark" bg="black" fixed="bottom">
        <div className={styles.addVideoButton}>
        <PlusSquareFill
                // className={styles.bottomIcon}
               
                onClick = {() => setUploadModalShow(true)}
                
            
                />
        </div>
      </Navbar>
    )
}

export default NavbarBottom
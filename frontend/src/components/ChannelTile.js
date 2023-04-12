import React from "react";
import { Badge, Col, Row } from "react-bootstrap";

const ChannelTile = ({
   
    channel,
    profile,
    address,
    chatModalShow,
    setChatModalShow,
    chatAddress,
    setChatAddress
}) => {
    return (
        
        <div style={{
            
            padding : '20px',color:'white',fontWeight : 'bold',fontSize : '1rem',
            boxShadow:  '8px 8px 5px #15101f, 8px -8px 5px #33264b'
        
        }}>
        <Row>
            <Col sm="4" xs="4" md="4" lg="4">
                <img height='50px' width='50px' src={profile} />
            </Col>
            <Col sm="6" xs="6" md="6" lg="6" style={{display : 'flex',flexDirection : 'column',alignContent : 'flex-start'}}>
                
                    <p>{channel}</p>
                    <p style={{fontWeight : 'lighter' , fontSize : '0.8rem'}}
                    onClick={() => {
                        setChatAddress(address)
                        setChatModalShow(true)
                        

                    }}
                    >Tap to message </p>
                
            </Col>
            <Col sm="2" xs="2" md="2" lg="2">
                <Badge bg="primary" pill size="10px">0</Badge>
            </Col>
        </Row>
    </div>
    )
}

export default ChannelTile
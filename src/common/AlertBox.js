import  React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const AlertBox = (props) => {
 
    const [show, setShow] = useState(true);
    
    useEffect(()=>{
      let interval = setInterval(()=>{
          setShow(false);
      },3000); 
      return ()=>{
        clearInterval(interval);
      }
     },[show]); 

    if (show) {
      return (
        <>
        <br/>
        <Alert variant={props.variant} onClose={() => setShow(false) } >
             { props.content}
        </Alert>
        </>
      );
    } else {
      return null;
    }
   
    
}
export default AlertBox;
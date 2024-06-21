import  React from 'react';
import { Spinner } from 'react-bootstrap';

const SpinnerIcon = (props) => {
    
    return (
    <>
        <br/>
        <Spinner animation="border" role="status" variant="warning" style={{ width:props.width+'px', height:props.height+'px', marginTop:props.marginTop+'px'}}/>
    </>
    );
}
export default SpinnerIcon;
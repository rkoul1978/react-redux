import React from 'react';
import { Row, Col, FormLabel } from 'react-bootstrap';

const MuiTableDescription = ({descData}) =>{

    return (
        <Row>
        {
            descData.map(product => (
            <Col key={product} sm="4">
            {
                <>
                <Row>
                <Col style={{ marginTop: '1.5em'}}>
                    <FormLabel><strong>{product.title}</strong></FormLabel>
                </Col>
                </Row>
                <img style={{ padding:'10px', border:'2px solid red' }} src={product.thumbnail}/> 
                </>
            }
            </Col>
            ))
        }
        </Row>
    );
}

export default MuiTableDescription;
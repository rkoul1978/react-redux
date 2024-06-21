import React from "react";
import { Row, Col } from "react-bootstrap";
import { CtiAdminSideMenu   } from "./CtiAdminSideMenu";

const CtiContact = () => {
  return (
          <Row>
            <Col lg="1">
              <CtiAdminSideMenu/>
            </Col>
            <Col lg="11" id="page-content-wrapper" className="App">
               This is Cti Contacts Page.
            </Col> 
          </Row>
        );
};
export default CtiContact;
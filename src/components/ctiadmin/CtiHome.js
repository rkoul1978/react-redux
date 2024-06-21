import React, { useEffect } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { CtiAdminSideMenu   } from "./CtiAdminSideMenu";

const CtiHome = () => {

  useEffect(() => {
    const getData = async () => {
      const { data: response } = await axios.get("http://localhost:4000/students/");
      console.log(response)
    };
    getData();
  }, [])

  return (
        <Row>
          <Col lg="1">
            <CtiAdminSideMenu/>
          </Col>
          <Col lg="11" id="page-content-wrapper">
            This is Cti Home Page.
          </Col> 
        </Row>
      );
};
export default CtiHome;
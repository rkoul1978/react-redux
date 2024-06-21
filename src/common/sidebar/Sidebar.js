import React, { useContext } from "react";
import {Nav} from "react-bootstrap";
import { Link } from "react-router-dom";
import { CtiMenuContext } from "../../components/ctiadmin/CtiAdminSideMenu";
import './Sidebar.scss';

const Sidebar = () => {
    const menuList = useContext(CtiMenuContext);
        return (
           <Nav className="col-md-12 d-none d-md-block bg-light sidebar" activeKey="ctihome" onSelect={selectedKey => console.log(`selected ${selectedKey}`)}>
                {
                    menuList.map((item) => {
                    return  ( <Nav.Item key={item.key}>
                                    <Nav.Link eventKey={item.key} as={Link} to={item.path}>
                                        {item.label}
                                    </Nav.Link>
                                </Nav.Item> 
                            )
                    })
                }
            </Nav>
        );
   
  };
 export default Sidebar

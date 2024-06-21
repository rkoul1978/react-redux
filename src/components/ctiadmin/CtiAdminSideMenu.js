/*import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Outlet, Link, useMatch, useLocation } from "react-router-dom";

class CtiAdmin extends Component {
  render() {
    return (
      <div>
          <Tabs defaultActiveKey="serviceRegions" id="ctiAdminTab" variant="pills">
            <Tab eventKey="serviceRegions" title="Service Regions">
              Service Regions
            </Tab>
            <Tab eventKey="ctiPg" title="CTI PG">
              CTI PG
            </Tab>
            <Tab eventKey="configJVMS" title="Config JVMs">
              Config JVMs
            </Tab>
            <Tab eventKey="adminRefresh" title="Admin Refresh">
              Admin Refresh
            </Tab>
        </Tabs>
      </div>
    );
  }
}
export { CtiAdmin };

const CtiAdmin = () => {
  const location = useLocation();
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to={`${location.pathname}/CtiHome`}>Home</Link>
          </li>
          <li>
            <Link to={`${location.pathname}/CtiBlogs`}>Blogs</Link>
          </li>
          <li>
            <Link to={`${location.pathname}/CtiContact`}>Contact</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}; */

import React from "react";
import Sidebar from "../../common/sidebar/Sidebar";

const menuList = [{ key: 'ctihome',label:'Cti Home',path:'/workhub/CtiAdmin/CtiHome'},
                  { key: 'ctiblogs',label:'Cti Blogs',path:'/workhub/CtiAdmin/CtiBlogs'},
                  { key:'cticontact',label:'Cti Contact',path:'/workhub/CtiAdmin/CtiContact'}];

export const CtiMenuContext = React.createContext();

export const CtiAdminSideMenu = ()  => {
  return (
      <div id="sidebar-wrapper">
        <CtiMenuContext.Provider value={menuList}>
          <Sidebar/>
        </CtiMenuContext.Provider>
      </div>
  );
};
export default CtiAdminSideMenu;




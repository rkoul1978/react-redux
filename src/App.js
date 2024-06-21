import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Nav } from 'react-bootstrap';
import { Tab, Row, Col } from 'react-bootstrap';
import { Users } from './components/Users';
import { Profiles } from './components/Profiles';
import { ErrorCodes } from './components/ErrorCodes';
import  Departments  from './components/Departments';
import  Alerts  from './components/Alerts';
import  CtiAdmin  from './components/ctiadmin/CtiAdminSideMenu';
import  CtiHome   from './components/ctiadmin/CtiHome';
import  CtiBlogs   from './components/ctiadmin/CtiBlogs';
import  CtiContact  from './components/ctiadmin/CtiContact';
import { Search } from './components/Search';
import  MuiTable  from './components/MuiTable/MuiTable';
import SpinnerIcon from './common/SpinnerIcon';
import Header from './common/Header';
import userProfileData from './json/user_profiles.json';


//************ redux thunk api's **********************/
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers/index';

//const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
export const store = createStore(rootReducer, applyMiddleware(reduxThunk))

class Workhub extends Component {

  constructor(){
   super();
   this.state ={
     showAccordion: false,
     loadUserProfiles: [],
     loadAttributes: [],
     loadTemplates:[],
     showSpinner: false
   };
   this.handleSelect = this.handleSelect.bind(this);
  }
  
  render() {
   // let match = useMatch();
    let path = "/workhub";
   
    return (
      <Provider store={store}>
        <div className="App">
                <BrowserRouter>
                  <nav>
                    <Link to="/"><Header/></Link>
                  </nav>
                  <div className="marginLeftTabs">
                    <Tab.Container defaultActiveKey="" id="uncontrolled-tab-example" variant="pills" onSelect={this.handleSelect}>
                          <Nav>
                              <Nav.Item>
                                  <Nav.Link eventKey="users" as={Link} to={`${path}/Users`}>Users</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="profiles" as={Link} to={`${path}/Profiles`}>Profiles</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="search" as={Link} to={`${path}/Search`}>Search</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="errorcodes" as={Link} to={`${path}/ErrorCodes`}>Error Codes</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="departments" as={Link} to={`${path}/Departments`}>Departments</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="alerts" as={Link} to={`${path}/Alerts`}>Alerts</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="ctiadmin" as={Link} to={`${path}/CtiAdmin/CtiHome`}>Cti Admin</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                  <Nav.Link eventKey="mui-table" as={Link} to={`${path}/MuiTable`}>MUI Table</Nav.Link>
                              </Nav.Item>
                          </Nav>
                      </Tab.Container>
                      <Tab.Content>
                      {
                          ( !this.state.showSpinner ) && 
                          <Routes>
                              <Route path="/" element= { <Navigate to={path} /> }  />
                              <Route path={`${path}`} element = { <></> } />
                              <Route path={`${path}/Users`} element={ <Users loadUserProfiles={this.state.loadUserProfiles}/> } />
                              <Route path={`${path}/Profiles`} element={ <Profiles showAccordion={this.state.showAccordion} loadUserProfiles={this.state.loadUserProfiles} /> } />
                              <Route path={`${path}/Search`} element={ <Search loadAttributes={this.state.loadAttributes} loadTemplates={this.state.loadTemplates} /> } />
                              <Route path={`${path}/ErrorCodes`} element = { <ErrorCodes/> } />
                              <Route path={`${path}/Departments`} element = { <Departments/> } />
                              <Route path={`${path}/Alerts`} element = { <Alerts/> } />
                              <Route path={`${path}/CtiAdmin/CtiHome`} element = { <CtiHome/> } />
                              <Route path={`${path}/CtiAdmin/CtiBlogs`} element = { <CtiBlogs/> } />
                              <Route path={`${path}/CtiAdmin/CtiContact`} element = { <CtiContact/> } />
                              <Route path={`${path}/MuiTable`} element = { <MuiTable/> } />
                          </Routes>
                      }
                      </Tab.Content>
                  </div>
                </BrowserRouter>
                {
                  ( this.state.showSpinner ) && 
                  <Row>
                      <Col lg="12">
                        <SpinnerIcon marginTop='100' />
                      </Col>
                  </Row>
                }
        </div>
      </Provider>
     
    );
  }
 goToHome(){
  console.log('home');
 }
 handleSelect(key) {
   if(key === 'users' || key === 'profiles'){
      this.setState({showSpinner: true});
      this.fetchUserProfiles().then((userProfiles) =>{
        this.setState({loadUserProfiles: userProfiles.ctiGuiUserProfiles});
        this.setState({showSpinner: false});
      }).catch(error => {
        this.setState({loadUserProfiles: []});
        this.setState({showSpinner: false});
      }); 
    }
    if(key === 'search'){
      this.setState({showSpinner: true});

      this.fetchTemplates().then((templatesData) => {
        this.setState({loadTemplates: templatesData});
      }).catch(error => {
        this.setState({loadTemplates: [{name:'No Data',id:0}]});
      });

      this.fetchAttributes().then((attributesData) =>{
        this.setState({loadAttributes: attributesData});
        this.setState({showSpinner: false});
      }).catch(error => {
        this.setState({loadAttributes: [{attributeName:'No Data',displayName:'No Data',attributeId:0}]});
        this.setState({showSpinner: false});
      });
    }
  } 
  async fetchTemplates(){
    const response = await fetch('https://10-119-14-212.ebiz.verizon.com:8443/surveyadmin/template/retriveTemplates', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUudXNlcmRldGFpbHMuVXNlckBiMjg3MGJiNjogVXNlcm5hbWU6IDI1NzI4NTE7IFBhc3N3b3JkOiBbUFJPVEVDVEVEXTsgRW5hYmxlZDogdHJ1ZTsgQWNjb3VudE5vbkV4cGlyZWQ6IHRydWU7IGNyZWRlbnRpYWxzTm9uRXhwaXJlZDogdHJ1ZTsgQWNjb3VudE5vbkxvY2tlZDogdHJ1ZTsgR3JhbnRlZCBBdXRob3JpdGllczogYWRtaW4sY29tcGFueUFkbWluLGl0QWRtaW4scmVhZCIsInVzZXJJZCI6IjI1NzI4NTEiLCJyb2xlIjoiW2FkbWluLCBjb21wYW55QWRtaW4sIGl0QWRtaW4sIHJlYWRdIn0.mThA9LDTGBKG1232kCC_MiBs3n8swd97rNpH2pPQlbbgTwXcMaOXjm9_4jII2-_hH3ZxTmxQdWxfVcQDPM3BWw'
          },
          body:  null
          });
    const templates = await response.json();
    return templates;
  }
  async fetchAttributes(){
    const response = await fetch('https://10-119-14-212.ebiz.verizon.com:8443/surveyadmin/common/retrieveAllAttributes', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUudXNlcmRldGFpbHMuVXNlckBiMjg3MGJiNjogVXNlcm5hbWU6IDI1NzI4NTE7IFBhc3N3b3JkOiBbUFJPVEVDVEVEXTsgRW5hYmxlZDogdHJ1ZTsgQWNjb3VudE5vbkV4cGlyZWQ6IHRydWU7IGNyZWRlbnRpYWxzTm9uRXhwaXJlZDogdHJ1ZTsgQWNjb3VudE5vbkxvY2tlZDogdHJ1ZTsgR3JhbnRlZCBBdXRob3JpdGllczogYWRtaW4sY29tcGFueUFkbWluLGl0QWRtaW4scmVhZCIsInVzZXJJZCI6IjI1NzI4NTEiLCJyb2xlIjoiW2FkbWluLCBjb21wYW55QWRtaW4sIGl0QWRtaW4sIHJlYWRdIn0.mThA9LDTGBKG1232kCC_MiBs3n8swd97rNpH2pPQlbbgTwXcMaOXjm9_4jII2-_hH3ZxTmxQdWxfVcQDPM3BWw'
          },
          body:  null
          });
    const attributes = await response.json();
    return attributes;
  }
  async fetchUserProfiles() {
 /*   const response = await fetch('/workhub/jer/login/getprofiles?US_WIN=z518824', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:  null
    });
    const userProfiles = await response.json();
    return userProfiles;*/
    return userProfileData;
  }
}
export default Workhub;
//<img src={logo} className="App-logo" alt="logo" /> 
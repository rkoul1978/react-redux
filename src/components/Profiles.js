import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Row, Col, Accordion, useAccordionButton,  Card, Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/main.css';
import SpinnerIcon from '../common/SpinnerIcon';
import AlertBox from '../common/AlertBox';

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSpinner: false,
      createProfile:false, 
      showAccordian: props.showAccordian,
      profileGridColumnDefs: [{
        headerName: "Profile ID", field: "profileId", sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
      },{
        headerName: "Description", field: "desc", width: 395, sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      }],
      profileGridRowData: [],

      srDeptColumnDefs: [{
        headerName: "Service Region", 
        field: "svcRegion", 
        width: 295,
      //  cellRenderer: SrDeptRenderer,
        cellStyle: {'textAlign':"left"},
        cellEditor: AutocompleteSelectCellEditor,
        cellEditorParams: {
          placeholder: 'Select Service Region',
          autocomplete: {
            fetch: (cellEditor, text, update) => {
                let match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
                this.fetchServiceRegions().then((srData) =>{
                  let filteredData = [];
                  srData.forEach((element) => {
                    if(element.id.toString().includes(match) || element.name.toLowerCase().includes(match) ) {
                      filteredData.push(element);
                    }
                  });
                  let items = filteredData.map(d => ({ value: d.id, label: d.name+' ('+d.id+')' }));
                  update(items);
                }).catch(error => {
                  update([{value:'',label:"No Data Found !"}]);
                });
            },
            strict: false,
            autoselectfirst: false
          },
          required: false
        },
        valueFormatter: (params) => {
          if (params.value !== undefined && params.value.value !== undefined) {
            return params.value.label || params.value.value || params.value;
          }
          return "";
        }, 
        editable: true
        },{
          headerName: "Department", 
          field: "dept", 
          width: 295,
          cellEditor: AutocompleteSelectCellEditor,
          cellStyle: {'textAlign':"left"},
          cellEditorParams: {
            selectData : [
              {value: 283, label: 'CS Center Ops Mgmt (283)'},
              {value: 172, label: 'Federal AOC (172)'},
              {value: 19, label: 'Customer Management Svcs (19)'},
              {value: 113, label: 'HQ Basking Ridge NJ (113)'},
              {value: 24, label: 'Telemarketing (24)'},
              {value: 30, label: 'Loyalty Management (30)'},
              {value: 44, label: 'Major/Corp/BSC Accts. (44)'},
              {value: 69, label: 'Customer Service Coordinators (69)'},
              {value: 308, label: 'Natl CS RM Planning Ops (308)'}
            ],
            placeholder: 'Select Department',
            autocomplete: {
              strict: false,
              autoselectfirst: false,
            },
            required: false
          },
          valueFormatter: (params) => {
            if (params.value !== undefined && params.value.value !== undefined) {
              return params.value.label || params.value.value || params.value;
            }
            return "";
          },
          editable: true
        },{
          headerName: "Country",
          field: "country",
          cellEditor: AutocompleteSelectCellEditor,
          cellStyle: {'textAlign':"left"},
          cellEditorParams: {
              autocomplete: {
                  fetch: (cellEditor, text, update) => {
                      let match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase();

               /*     let xmlHttp = new XMLHttpRequest();
                      xmlHttp.onreadystatechange = () => {
                          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                              let data = JSON.parse(xmlHttp.responseText);
                              let items = data.map(d => ({ value: d.fifa, label: d.name.common }));
                              update(items);
                          }
                          if (xmlHttp.status === 404) {
                              update(false);
                          }
                      };
                      xmlHttp.open("GET", `https://restcountries.com/v3.1/name/${match}`, true);
                      xmlHttp.send(null); */

                      this.fetchCountries(match).then((countryData) =>{
                        let filteredData = [];
                        countryData.forEach((element) => {  
                          if( element.name.common.toLowerCase().includes(match) || element.cca2.toLowerCase().includes(match)  ) {
                            filteredData.push(element);
                          }
                        });
                        let items = filteredData.map(d => ({ value: d.cca2, label: d.name.common }));
                        update(items);
                      }).catch(error => {
                        update([{value:'',label:"No Data Found !"}]);
                      });
                  },
                  strict: false,
                  autoselectfirst: false
              },
              placeholder: 'Select a country'
          },
          valueFormatter: (params) => {
              if (params.value) {
                  return params.value.label || params.value.value || params.value;
              }
              return "";
          },
          editable: true,
      }],
      srDeptGridRowData: [
        {svcRegion: undefined, dept:  undefined, country: undefined}
      ],
     
      availableConfigGridColumnDefs: [{
        headerName:"", field:"availableConfigDetailsID",hide: true },{
        headerName: "Available Config Details", field: "availableConfigDetails", width:250, sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true,suppressSizeToFit: false
      }],
      availableConfigGridRowData: [{ availableConfigDetails:'ALLOW_DECOUPLE_FOR_ISX_CONF',availableConfigDetailsID:'Available'},{availableConfigDetails:'AGENT_ACTIVITY',availableConfigDetailsID:'Available'},
      { availableConfigDetails:'BETA_MODE',availableConfigDetailsID:'Available'
      }],

      availableDialOptionsGridColumnDefs: [{
        headerName:"", field:"availableDialOptionsID",hide: true },{
        headerName: "Available Dial Options", field: "availableDialOptions", width:250,sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
      }],
      availableDialOptionsGridRowData: [{ availableDialOptions:'ALLOW_DECOUPLE_FOR_ISX_CONF',availableDialOptionsID:'Available'},{availableDialOptions:'AGENT_ACTIVITY',availableDialOptionssID:'Available'},
      { availableDialOptions:'BETA_MODE',availableDialOptionsID:'Available'
      }],

      editableConfigGridColumnDefs: [{
        headerName:"", field:"editableConfigDetailsID",hide: true},{
        headerName: "Editable Config Details", field: "editableConfigDetails", width:250, sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
      }],
      editableConfigGridRowData: [{ editableConfigDetails:'CALL_BACK',editableConfigDetailsID:'Editable'},{editableConfigDetails:'CALL_HISTORY',editableConfigDetailsID:'Editable'},
      { editableConfigDetails:'CALL_STATS', editableConfigDetailsID:'Editable'
      }],
      selectedConfigGridColumnDefs: [{
        headerName:"", field:"selectedConfigDetailsID",hide: true},{
        headerName: "Selected Config Details", field: "selectedConfigDetails", width:250, sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
      }],
      selectedConfigGridRowData: []
    };
  }

  addCellBlurListener = () => {
    const target = document.activeElement;
    if (target) {
        target.addEventListener('blur', this.onCellBlur);
    }
  };
  onCellBlur = () => {};
  
  onCreateProfileClick = e => {
    this.srDeptGridApi.setFocusedCell(0, 'svcRegion', 'bottom');
    this.setState({showSpinner:true});
    this.setState({createProfile:false});
    
    let interval = setInterval(()=>{
      this.setState({showSpinner:false});
      this.setState({createProfile:true});
    },3000); 
    return ()=>{
      clearInterval(interval);
    }
  }
  render() {
     return (
      <div>
        {
          (this.state.createProfile) &&
            <AlertBox variant='success' content='Profile Created Successfully !' /> 
        }
        <br/>  
        <div className="row">
            <div className="col ag-theme-balham marginTopGrid" style={{  height: '200px', width: '600px' }}>
              <AgGridReact
                onGridReady={ (params)=>{
                  this.profileGridApi = params.api;
                  this.profileGridApi.selectAll();
                 } }
                columnDefs={this.state.profileGridColumnDefs}
                rowData={this.props.loadUserProfiles}
                rowSelection="multiple"
                onSelectionChanged = { this.onSelectionChanged.bind(this) }
                >
              </AgGridReact>
            </div>
            <div className="col ag-theme-balham marginTopGrid" style={{  height: '200px', width: '600px' }}>
              <AgGridReact
                onGridReady={ (params)=>{
                  this.srDeptGridApi = params.api;
                } }
                columnDefs={this.state.srDeptColumnDefs}
                rowData={this.state.srDeptGridRowData}
                onCellFocused={(e) => this.addCellBlurListener()}
                >
              </AgGridReact>
            </div>
        </div>
        <div className="row marginTopGrid">
          <div className="col-lg-10">
          </div>      
          <div className="col-lg-2">
            <Button variant="primary" onClick={ this.onCreateProfileClick } >Create Profile</Button>
          </div>
        </div>
        {
            this.state.showSpinner &&  
            <Row>
              <Col lg="12">
                <SpinnerIcon marginTop='0' />
              </Col>
            </Row>
        }
        { 
          this.state.showAccordian && 
            <div className="row marginLeftAccordion marginTopGrid marginRightGrid">
             <Accordion defaultActiveKey="0">
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="0">
                    Config Details
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <div className="row">
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.availConfigGridApi = params.api;
                              } }
                              columnDefs={this.state.availableConfigGridColumnDefs}
                              rowData={this.state.availableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.editableConfigGridApi = params.api;
                              } }
                              columnDefs={this.state.editableConfigGridColumnDefs}
                              rowData={this.state.editableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col">
                          <ButtonToolbar aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                              <Button variant="secondary" className="addRemoveBtnWidth" onClick={ this.onAddConfigClick }>Add</Button>
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                              <Button variant="secondary" className="addRemoveBtnWidth" onClick={ this.onRemoveConfigClick }>Remove</Button>
                            </ButtonGroup>
                          </ButtonToolbar>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px', paddingLeft: '2px', paddingRight: '2px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.selectedConfigGridApi = params.api;
                              } }
                              columnDefs={this.state.selectedConfigGridColumnDefs}
                              rowData={this.state.selectedConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col">
                          <Button id="accordionUpdateBtn" variant="primary">Update</Button>
                        </div>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                <CustomToggle eventKey="1">
                    Dial Options
                </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <div className="row">
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.availDialOptionsGridApi = params.api;
                              } }
                              columnDefs={this.state.availableDialOptionsGridColumnDefs}
                              rowData={this.state.availableDialOptionsGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.editableConfigGridColumnDefs}
                              rowData={this.state.editableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col">
                          <ButtonToolbar aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Add</Button>
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Remove</Button>
                            </ButtonGroup>
                          </ButtonToolbar>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px', paddingLeft: '2px', paddingRight: '2px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.selectedConfigGridColumnDefs}
                              rowData={this.state.selectedConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                          </div>
                          <div className="col">
                            <Button id="accordionUpdateBtn" variant="primary">Update</Button>
                          </div>
                    </div>        
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                <CustomToggle eventKey="2">
                    Help Instructions
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="3">
                    Logout Codes
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                  <Card.Body>
                    <div className="row">
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.availableConfigGridColumnDefs}
                              rowData={this.state.availableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col">
                          <ButtonToolbar aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Add</Button>
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Remove</Button>
                            </ButtonGroup>
                          </ButtonToolbar>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px', paddingLeft: '2px', paddingRight: '2px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.selectedConfigGridColumnDefs}
                              rowData={this.state.selectedConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col"></div>
                        <div className="col">
                            <Button id="accordionUpdateBtn" variant="primary">Update</Button>
                        </div>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="4">
                    Not Ready/WrapUp Options
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    <div className="row">
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.availableConfigGridColumnDefs}
                              rowData={this.state.availableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.editableConfigGridColumnDefs}
                              rowData={this.state.editableConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                        </div>
                        <div className="col">
                          <ButtonToolbar aria-label="Toolbar with button groups">
                            <ButtonGroup className="mr-2" aria-label="First group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Add</Button>
                            </ButtonGroup>
                            <ButtonGroup className="mr-2" aria-label="Second group">
                              <Button variant="secondary" className="addRemoveBtnWidth">Remove</Button>
                            </ButtonGroup>
                          </ButtonToolbar>
                        </div>
                        <div className="col ag-theme-balham" style={{  height: '200px', width: '350px', paddingLeft: '2px', paddingRight: '2px' }}>
                            <AgGridReact
                              onGridReady={ (params)=>{
                                this.gridApi = params.api;
                              } }
                              columnDefs={this.state.selectedConfigGridColumnDefs}
                              rowData={this.state.selectedConfigGridRowData}
                              rowSelection="multiple"
                              >
                            </AgGridReact>
                          </div>
                          <div className="col">
                            <Button id="accordionUpdateBtn" variant="primary">Update</Button>
                          </div>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <CustomToggle eventKey="5">
                    Blocked Department Options
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="5">
                  <Card.Body>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            </div>
        }                
      </div>
    );
  }

  componentDidMount() {}
  
  async fetchServiceRegions(){
    const response = await fetch('https://10-119-14-212.ebiz.verizon.com:8443/surveyadmin/common/retriveServiceRegion', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUudXNlcmRldGFpbHMuVXNlckBiMjg3MGJiNjogVXNlcm5hbWU6IDI1NzI4NTE7IFBhc3N3b3JkOiBbUFJPVEVDVEVEXTsgRW5hYmxlZDogdHJ1ZTsgQWNjb3VudE5vbkV4cGlyZWQ6IHRydWU7IGNyZWRlbnRpYWxzTm9uRXhwaXJlZDogdHJ1ZTsgQWNjb3VudE5vbkxvY2tlZDogdHJ1ZTsgR3JhbnRlZCBBdXRob3JpdGllczogYWRtaW4sY29tcGFueUFkbWluLGl0QWRtaW4scmVhZCIsInVzZXJJZCI6IjI1NzI4NTEiLCJyb2xlIjoiW2FkbWluLCBjb21wYW55QWRtaW4sIGl0QWRtaW4sIHJlYWRdIn0.mThA9LDTGBKG1232kCC_MiBs3n8swd97rNpH2pPQlbbgTwXcMaOXjm9_4jII2-_hH3ZxTmxQdWxfVcQDPM3BWw'
          },
          body:  null
          });
    const sr = await response.json();
    return sr;
  }

  async fetchCountries(match){
    const response = await fetch('https://restcountries.com/v3.1/name/'+match, {
          method: 'GET',
          body:  null
          });
    const countries = await response.json();
    return countries;
  }

  onSelectionChanged(){
    if(this.profileGridApi.getSelectedRows().length === 0){
      this.setState({showAccordian :false});  
    } else {
      this.setState({showAccordian :true});
      this.srDeptGridApi.setFocusedCell(0, 'svcRegion', 'bottom');
      this.setState({srDeptGridRowData:[ {svcRegion: 168, dept:  undefined, country: undefined } ]});

    }
  }

  onRemoveConfigClick = e => {
    let selectedNodes =  this.selectedConfigGridApi.getSelectedNodes();
    if(selectedNodes.length > 0){
      let selectedRows =  this.selectedConfigGridApi.getSelectedRows();

      /* Adding Selected to the Available & Editable Grid */
      let selectedData = selectedNodes.map( node => node.data )
      selectedData.forEach((node)=> {
        if(node.selectedConfigDetailsID === 'Available'){
          this.availConfigGridApi.applyTransaction({ add: [{availableConfigDetailsID:node.selectedConfigDetailsID,
            availableConfigDetails:node.selectedConfigDetails}]});
        } else if(node.selectedConfigDetailsID === 'Editable'){
          this.editableConfigGridApi.applyTransaction({ add: [{editableConfigDetailsID:node.selectedConfigDetailsID,
            editableConfigDetails:node.selectedConfigDetails}]});
        }
      }); 
      /* Removing Selected from the Selected Grid */
      this.selectedConfigGridApi.applyTransaction({ remove: selectedRows });
    }
  }

  onAddConfigClick = e => {
    let selectedNodes =  this.availConfigGridApi.getSelectedNodes();
    if(selectedNodes.length > 0){
      let selectedRows =  this.availConfigGridApi.getSelectedRows();
        
      /* Adding Available to the Selected Grid */
      let selectedData = selectedNodes.map( node => node.data )
      //let selectedColumnData = selectedData.map( node => node.availableConfigDetails);
      selectedData.forEach((node)=> {
        this.selectedConfigGridApi.applyTransaction({ add: [{selectedConfigDetailsID:node.availableConfigDetailsID,
          selectedConfigDetails:node.availableConfigDetails}]});
      });
  
      /* Removing Selected from the Available Grid */
      this.availConfigGridApi.applyTransaction({ remove: selectedRows });
    }
      //============================================================================================================================
  
    selectedNodes =  this.editableConfigGridApi.getSelectedNodes();
    if(selectedNodes.length > 0){
      let selectedRows =  this.editableConfigGridApi.getSelectedRows();
          
      /* Adding Editable to the Selected Grid */
      let selectedData = selectedNodes.map( node => node.data )
      selectedData.forEach((node)=> {
        this.selectedConfigGridApi.applyTransaction({ add: [{selectedConfigDetailsID:node.editableConfigDetailsID,
          selectedConfigDetails:node.editableConfigDetails}]});
      });

      /* Removing Selected from the Editable Grid */
      this.editableConfigGridApi.applyTransaction({ remove: selectedRows });
    }
  }
}

/*class SrDeptRenderer {
  init(params) {
    console.log(params);
    this.eGui = '';   
  }
  getGui() {
      return this.eGui;        
  }
}*/

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );
  return (
    <button
      type="button"
      style={{ border: 'none', backgroundColor:'transparent' }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}
export default CustomToggle
export { Profiles };

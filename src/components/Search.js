import React, { Component } from 'react';
import '../App.scss';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { Form, Row, Col, ButtonToolbar, Button, ButtonGroup } from 'react-bootstrap';

import AutoComplete from '../common/AutoComplete';
import AlertBox from '../common/AlertBox';
import SpinnerIcon from '../common/SpinnerIcon';

class Search extends Component {
  constructor(props) {
    super(props);
    
    this.contactDate = React.createRef();
    this.attribute = React.createRef();
    this.template = React.createRef();
    this.searchGridRef = React.createRef();
    this.state = {
        showSpinner: false, 
        columnDefs: [{
            headerName: "Survey Id", field: "surveyId", sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
        },{
            headerName: "Employee", field: "employeeName", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
        },{
            headerName: "MTN", field: "mtn", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
        },{
            headerName: "Status Reason", field: "statusReason", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
        },{
            headerName: "Contact Date", field: "createDateTime", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
        },{
            headerName: "Segment", field: "segment", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
        }],
        rowData: [],
        defaultColDef: {
            editable: true,
            resizable: true
        },
        selectedTemplateId: ''
    };
  }
 
  handleTemplateSelectedCallback = (selectedTemplate) =>{
   if(selectedTemplate != null) {
    this.setState({selectedTemplateId:selectedTemplate.id.toString()});
   } else {
    this.setState({selectedTemplateId:''});
   }
  }
  handleTemplateResetCallback = (selectedTemplate) =>{
    if(selectedTemplate != null){
      this.template = selectedTemplate;
    }
  }
  render() {
    let attributeSelectOptions = this.props.loadAttributes.map(element => (
        <option key={element.attributeName} value={element.attributeId}>{element.displayName}</option>
    ));
    return (
        <div>
            { 
              (this.props.loadTemplates.length === 1 || this.props.loadAttributes.length === 1 ) && 
                <AlertBox variant='danger' content='Failed to load Data !' />  
            }
            {
              (this.state.rowData.length === 1) &&
                <AlertBox variant='danger' content='Failed to load Data !' /> 
            }
          <br/>  
          <Form>
            <Form.Group controlId="formPlaintextSearch">
              <Row className="mb-4">
                <Form.Label column sm="1">
                  Search by:
                </Form.Label>
                <Form.Label column sm="1">
                  Contact Date:
                </Form.Label>
                <Col sm="2">
                  <Form.Control type="date" name='contactDate' ref={this.contactDate} />
                </Col>
                <Form.Label column sm="1">
                  Attribute:
                </Form.Label>
                <Col sm="2">
                  <Form.Select ref={this.attribute} onChange={this.attributeChange.bind(this)}>
                      <option key="" value="">Select...</option>
                      {attributeSelectOptions}
                  </Form.Select>
                </Col>
                <Form.Label column sm="1">
                  Template:
                </Form.Label>
                <Col sm="2">
                  <AutoComplete data='templates' loadData={this.props.loadTemplates} selectedCallback={this.handleTemplateSelectedCallback} resetCallback={this.handleTemplateResetCallback}/>
                </Col>
              </Row>
              <Row className="justify-content-md-center mb-4">
                <Col lg="3">
                  <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup className="mr-2" aria-label="First group">
                      <Button variant="secondary" className="addBtnWidth" onClick={this.searchClicked.bind(this)}>Search</Button>
                    </ButtonGroup>
                    <ButtonGroup className="mr-2" aria-label="Second group">
                      <Button variant="secondary" className="addBtnWidth" onClick={this.resetClicked.bind(this)}>Reset</Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          {
            this.state.showSpinner &&  
            <Row>
              <Col lg="11">
                <SpinnerIcon marginTop='15' />
              </Col>
            </Row>
          }
        
          <div ref={this.searchGridRef} className="ag-theme-balham marginRightGrid marginTopGrid" style={{ height: '500px'  }}>
            <AgGridReact
              onGridReady= { (params)=>{
                this.gridApi = params.api;
                this.gridApi.sizeColumnsToFit();
              }}
              columnDefs={this.state.columnDefs}
            //   rowData={this.state.rowData}
              defaultColDef={this.state.defaultColDef}
              rowSelection="multiple"
              pagination={true}
              paginationAutoPageSize={true}
              rowModelType={'serverSide'}
              serverSideStoreType={'partial'}
              paginationPageSize={15}
              cacheBlockSize={15}
              //getRowNodeId= {(item) =>{ item.surveyId.toString();  }}
              >
            </AgGridReact>
          </div>
          
        </div>  
    );
   
  }
  
  getServerSideDatasource = (contactDate,selectedTemplateId) => {
   let self = this;
   return {
      getRows: function (params) {
        console.log('[Datasource] - rows requested by grid: ', params.request);
        let data = {"from":params.request.startRow,"to":self.gridApi.paginationGetPageSize(),"customAttributeId":"","searchTerm":"","attributeId":"","offerOn":contactDate,"offerOnTo":"","segmentIds":"","serviceRegionIds":"","deptIds":"","criteriaIds":"","templateIds":selectedTemplateId,"lang":"","statusType":"","statusReason":""}
        fetch('https://10-119-14-212.ebiz.verizon.com:8443/surveyadmin/common/searchSurveyByCriteria', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUudXNlcmRldGFpbHMuVXNlckBiMjg3MGJiNjogVXNlcm5hbWU6IDI1NzI4NTE7IFBhc3N3b3JkOiBbUFJPVEVDVEVEXTsgRW5hYmxlZDogdHJ1ZTsgQWNjb3VudE5vbkV4cGlyZWQ6IHRydWU7IGNyZWRlbnRpYWxzTm9uRXhwaXJlZDogdHJ1ZTsgQWNjb3VudE5vbkxvY2tlZDogdHJ1ZTsgR3JhbnRlZCBBdXRob3JpdGllczogYWRtaW4sY29tcGFueUFkbWluLGl0QWRtaW4scmVhZCIsInVzZXJJZCI6IjI1NzI4NTEiLCJyb2xlIjoiW2FkbWluLCBjb21wYW55QWRtaW4sIGl0QWRtaW4sIHJlYWRdIn0.mThA9LDTGBKG1232kCC_MiBs3n8swd97rNpH2pPQlbbgTwXcMaOXjm9_4jII2-_hH3ZxTmxQdWxfVcQDPM3BWw'
          },
          body:  JSON.stringify(data)
          }).then(result => result.json())
          .then((gridData) => {
            params.success({
              rowData: gridData.surveys,
              rowCount:gridData.noOfRecords
            });
            if(gridData.surveys.length > 0){
              self.setState({rowData: gridData.surveys});
            } else {
              self.setState({rowData: [{'surveyId':'No Data Found'}]});
            }
            self.setState({showSpinner:false});
            self.searchGridRef.current.style.display = 'block';
          })
          .catch(error => {
            params.success({
              rowData: [],
              rowCount:0
            });
            self.setState({showSpinner:false});
            self.searchGridRef.current.style.display = 'block';
            self.setState({rowData: [{'surveyId':'No Data Found'}]});
          });
        }
      };
    }
  

  attributeChange(event){
      console.log(this.attribute.current.value);
  }
  searchClicked(){      /* Server Side Loading  */
    this.setState({showSpinner:true});
    this.setState({rowData: []});
    this.searchGridRef.current.style.display = 'none';
    this.gridApi.setServerSideDatasource(this.getServerSideDatasource(this.contactDate.current.value, this.state.selectedTemplateId));
  }
  /*searchClicked(){     // Client Side Loading  
    this.setState({showSpinner:true});
    this.setState({rowData: []});
     let data = {"from":0,"to":10,"customAttributeId":"","searchTerm":"","attributeId":"","offerOn":this.contactDate.current.value,"offerOnTo":"","segmentIds":"","serviceRegionIds":"","deptIds":"","criteriaIds":"","templateIds":this.state.selectedTemplateId,"lang":"","statusType":"","statusReason":""}
    fetch('https://10-119-14-212.ebiz.verizon.com:8443/surveyadmin/common/searchSurveyByCriteria', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'jtoken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvcmcuc3ByaW5nZnJhbWV3b3JrLnNlY3VyaXR5LmNvcmUudXNlcmRldGFpbHMuVXNlckBiMjg3MGJiNjogVXNlcm5hbWU6IDI1NzI4NTE7IFBhc3N3b3JkOiBbUFJPVEVDVEVEXTsgRW5hYmxlZDogdHJ1ZTsgQWNjb3VudE5vbkV4cGlyZWQ6IHRydWU7IGNyZWRlbnRpYWxzTm9uRXhwaXJlZDogdHJ1ZTsgQWNjb3VudE5vbkxvY2tlZDogdHJ1ZTsgR3JhbnRlZCBBdXRob3JpdGllczogYWRtaW4sY29tcGFueUFkbWluLGl0QWRtaW4scmVhZCIsInVzZXJJZCI6IjI1NzI4NTEiLCJyb2xlIjoiW2FkbWluLCBjb21wYW55QWRtaW4sIGl0QWRtaW4sIHJlYWRdIn0.mThA9LDTGBKG1232kCC_MiBs3n8swd97rNpH2pPQlbbgTwXcMaOXjm9_4jII2-_hH3ZxTmxQdWxfVcQDPM3BWw'
      },
      body:  JSON.stringify(data)
      }).then(result => result.json())
      .then((gridData) => {
        if(gridData.surveys.length > 0){
          this.setState({rowData: gridData.surveys});
        } else {
          this.setState({rowData: [{'surveyId':'No Data Found'}]});
        }
        this.setState({showSpinner:false});
      })
      .catch(error => {
        this.setState({showSpinner:false});
        this.setState({rowData: [{'surveyId':'No Data Found'}]});
      }); 
  }*/
  
  resetClicked(){
    this.setState({selectedTemplateId: '',rowData: []});
    this.gridApi.setServerSideDatasource(null);
    this.contactDate.current.value=null;
    this.attribute.current.value='';
    this.template.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
    this.contactDate.current.focus();
  }
  componentDidMount() {} 
  componentDidUpdate(){}
  componentWillUnmount(){}
}
export {Search};




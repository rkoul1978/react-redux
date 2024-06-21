import React, { Component  } from 'react';
import '../App.scss';
import { AgGridReact } from 'ag-grid-react';
import { Form, Row, Col, ButtonToolbar, Button, ButtonGroup } from 'react-bootstrap';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [{
        headerName: "USWIN", field: "uswin", sortable: true, filter: true, cellStyle: {'textAlign':"left"}, checkboxSelection: true
      },{
        headerName: "Agent ID", field: "agentId", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "CallCenter", field: "ctiServiceRegion.name", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "Extension", field: "extn", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "Role", field: "agentType", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "Dept ID", field: "deptId", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "Profile ID", field: "profileId", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      },{
        headerName: "UCCEPWD", field: "uccepwd", sortable: true, filter: true, cellStyle: {'textAlign':"left"}
      }],
      rowData: [],
      defaultColDef: {
        editable: true,
        resizable: true
      },
      searchValue: ''
    };
    this.searchValue = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset  = this.handleReset.bind(this);
  }

  render() {
    return (
        <div>
          <br/>
          <Form>
            <Form.Group as={Row} controlId="formPlaintextSearch">
              <Form.Label column sm="1">
                Search:
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" placeholder="USWIN" ref={this.searchValue} onInput={this.handleInput}/>
              </Col>
              <Col sm="6">
                <ButtonToolbar aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-2" aria-label="First group">
                    <Button variant="secondary" className="addBtnWidth" onClick={this.handleSearch}>Search</Button>
                  </ButtonGroup>
                  <ButtonGroup className="mr-2" aria-label="Second group">
                    <Button variant="secondary" className="addBtnWidth" onClick={this.handleReset}>Reset</Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Form.Group>
          </Form>
          <br/>
          <div className="ag-theme-balham marginRightGrid marginTopGrid" style={{ height: '200px'  }}>
            <AgGridReact
              onGridReady={ (params)=>{
                this.gridApi = params.api;
                this.gridApi.sizeColumnsToFit();
              }  }
              columnDefs={this.state.columnDefs}
              rowData={this.props.loadUserProfiles}
              defaultColDef={this.state.defaultColDef}
              rowSelection="multiple"
              >
            </AgGridReact>
          </div>
        </div>  
    );
  }

  handleInput(event){
    if(event.target.value === ''){
      this.handleReset();
    }
    let filteredRows = [];
    this.props.loadUserProfiles.forEach((row) => {
      if(row.agentId.includes(event.target.value) ) {
        filteredRows.push(row);
      }
    });
    if (filteredRows.length > 0){
      this.gridApi.setRowData(filteredRows);
    }
  }
 
  handleReset() {
    this.searchValue.current.value = '';
    this.searchValue.current.focus();
    this.gridApi.setRowData(this.props.loadUserProfiles);
  }

  handleSearch(event) {}
  componentDidMount() {} 
  componentDidUpdate(){}
}
export {Users};

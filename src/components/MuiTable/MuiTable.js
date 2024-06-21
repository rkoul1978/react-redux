/*import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CircularProgress from '@material-ui/core/CircularProgress'

const generateItems = amount => {
  const arr = Array.from(Array(amount))
  return arr.map((number, i) => ({
    id: i,
    name: `Name ${i + 1}`,
    type: `Item Type ${i + 1}`,
  }))
}
const MuiTable = () => {
  const tableEl = useRef()
  const [rows, setRows] = useState(generateItems(50))
  const [loading, setLoading] = useState(false)
  const [distanceBottom, setDistanceBottom] = useState(0)
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore] = useState(true)
  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          const amount = rows.length + 50
          setRows(generateItems(amount))
          setLoading(false)
          resolve()
        }, 2000)
      )
    }
    setLoading(true)
    loadItems()
  }, [rows])

  const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round((bottom / 100) * 20))
    }
    if (tableEl.current.scrollTop > bottom - distanceBottom && hasMore && !loading) {
      loadMore()
    }
  }, [hasMore, loadMore, loading, distanceBottom])


  useLayoutEffect(() => {
    const tableRef = tableEl.current
    tableRef.addEventListener('scroll', scrollListener)
    return () => {
      tableRef.removeEventListener('scroll', scrollListener)
    }
  }, [scrollListener])

  return (
    <>
    <br/><br/>
    <TableContainer style={{ maxWidth: '600px', margin: 'auto', maxHeight: '300px' }} ref={tableEl}>
      {loading && <CircularProgress style={{ position: 'absolute', top: '300px' }} />}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ id, name, type }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
    
  )
}
export default MuiTable */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { setTitle,setDescription, setPrice, setBrand, setStock,getRowData,editProduct,addProduct,deleteProduct,resetSelectedRowData,setLoading,showDialog,addBtnClick } from "../../actions/MuiAction";
import { connect } from "react-redux";
import 'react-toastify/dist/ReactToastify.min.css';

import EnhancedTableToolbar  from './EnhancedTableToolbar';
import MuiTableDescription from './MuiTableDescription';


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


const MuiTable= ({title,setTitle,description,setDescription,price,setPrice,brand,setBrand,stock,setStock,rowData,addedRowData,updatedRowData,deletedRowData,resetSelectedRowData,getRowData,addProduct,
                  editProduct,deleteProduct,setLoading,loading,showDialog,dialog,addBtnClick,addFlag}) => { 

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [rowData, setRowData] = useState([]);

  const onSelectAllClick = (event) => {
    addBtnClick(false);
    setTitle('');
    setDescription('');
    setPrice('');
    setBrand('');
    setStock('')
    if (event.target.checked) {
        const newSelected = rowData.map((row) => row);
        setSelectedRows(newSelected);
        return;
      }
    setSelectedRows([]);
  };

  const handleClick = (event, row) => {
    
    const selectedIndex = selectedRows.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    setSelectedRows(newSelected);
    addBtnClick(false);
    newSelected.length === 1 ? setTitle(newSelected[0].title) : setTitle('')
    newSelected.length === 1 ? setDescription(newSelected[0].description) : setDescription('')
    newSelected.length === 1 ? setPrice(newSelected[0].price) : setPrice('')
    newSelected.length === 1 ? setBrand(newSelected[0].brand) : setBrand('')
    newSelected.length === 1 ? setStock(newSelected[0].stock) : setStock('')
 };
  
  const isSelected = (row) => selectedRows.indexOf(row) !== -1;

  const toParent = () => {};

  const url = "https://dummyjson.com/products";

   useEffect(() => {
     getRowData(url);
 /*   const generateItems = async () => {
      const { data: response } = await axios.get(url);
      setRowData(response.products);
    };
    generateItems();    */ 
   }, [getRowData])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
   <>
    <Card style={{ width:99+'%' }}>
      <EnhancedTableToolbar title={title} setTitle={setTitle} description={description} setDescription={setDescription} price={price} setPrice={setPrice} brand={brand} setBrand={setBrand} stock={stock} setStock={setStock} rowData={rowData} 
                            toParent = {toParent} addedRowData = { addedRowData } updatedRowData = { updatedRowData} deletedRowData = {deletedRowData} 
                            editProduct ={editProduct} deleteProduct = {deleteProduct} addProduct ={addProduct} getRowData = {getRowData} selectedRows={selectedRows} 
                            resetSelectedRowData={resetSelectedRowData} setLoading={setLoading} loading={loading} showDialog={showDialog} dialog={dialog}
                            addBtnClick={addBtnClick} addFlag={addFlag} setSelectedRows={setSelectedRows}/>
      <TableContainer style={{ height:'auto' }}>
        <Table stickyHeader aria-label="mui table">
          <TableHead>
              <TableRow>
                <TableCell style={{ width: 50 }} component="th" scope="row">
                  <Checkbox 
                    color="primary" 
                    onChange={onSelectAllClick}
                    checked={ selectedRows.length === rowData.length}
                    indeterminate={ selectedRows.length> 0 && selectedRows.length < rowData.length}
                  />
                  <b>Title</b>
                </TableCell>
                <TableCell style={{ width: 50 }} component="th" scope="row">
                  <b>Description</b>
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                    <b>Price</b>
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                    <b>Brand</b>
                </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    <b>Stock</b>
                </TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rowData
            ).map((row) => {

              const isItemSelected = isSelected(row);
              return (
              <TableRow key={row.id} role="checkbox" onClick={(event) => handleClick(event, row)} selected={isItemSelected} hover>
                <TableCell style={{ width: 100 }} component="th" scope="row">
                  <Checkbox color="primary" checked={isItemSelected} />
                  {row.title} 
                </TableCell>
                <TableCell style={{ width: 50 }} component="th" scope="row">
                  {row.description} 
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.price}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.brand}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.stock}
                </TableCell>
              </TableRow>
              );
            })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[4, 10, 25, { label: 'All', value: -1 }]}
          component="div"
          colSpan={0}
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
    </Card>
    <Card style={{ width:99+'%',height:'auto', marginTop:5 }}>
      <MuiTableDescription descData={selectedRows}/>
    </Card>
   </>
  );
}

const mapStateToProps= (state) => ({
  title: state.muiReducer.title,
  description: state.muiReducer.description,
  price: state.muiReducer.price,
  brand: state.muiReducer.brand,
  stock: state.muiReducer.stock,
  rowData: state.muiReducer.rowData,
  updatedRowData: state.muiReducer.updatedRowData,
  addedRowData: state.muiReducer.addedRowData,
  deletedRowData: state.muiReducer.deletedRowData,
  loading: state.muiReducer.loading,
  dialog: state.muiReducer.dialog,
  addFlag: state.muiReducer.addFlag
});

const mapDispatchToProps = (dispatch) =>({
  setTitle: (title) => dispatch(setTitle(title)),
  setDescription: (description) => dispatch(setDescription(description)),
  setPrice: (price) => dispatch(setPrice(price)),
  setBrand: (brand) => dispatch(setBrand(brand)),
  setStock: (stock) => dispatch(setStock(stock)),
  getRowData: (url) => dispatch(getRowData(url)),
  editProduct: (url,data,index,selectedRows) => dispatch(editProduct(url,data,index,selectedRows)),
  addProduct:(url,data) => dispatch(addProduct(url,data)),
  deleteProduct:(url) => dispatch(deleteProduct(url)),
  resetSelectedRowData: () => dispatch(resetSelectedRowData()),
  setLoading: (loading) => dispatch(setLoading(loading)),
  showDialog: (flag) => dispatch(showDialog(flag)),
  addBtnClick: (flag) => dispatch(addBtnClick(flag))
});

export default connect(mapStateToProps,mapDispatchToProps)(MuiTable);
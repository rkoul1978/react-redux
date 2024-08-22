
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { alpha } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer,toast } from 'react-toastify';
import YesNoDialog  from '../../common/YesNoDialog';
import SpinnerDialog from '../../common/SpinnerDialog';

const EnhancedTableToolbar= ({title,setTitle,description,setDescription,price,setPrice,brand,setBrand,stock,setStock,rowData,toParent,editProduct,addProduct,deleteProduct,getRowData,addedRowData,
    deletedRowData,updatedRowData,selectedRows,resetSelectedRowData,setLoading,loading,showDialog,dialog,addBtnClick,addFlag,setSelectedRows,titleError,setTitleError,
    descError,setDescError,priceError,setPriceError,brandError,setBrandError,stockError,setStockError,resetErrors}) => { 

    const [filter,setFilter] = useState('');
  
    const titleChange = (e) => {
        setTitle(e.target.value);
        setTitleError(false);
    }
    const descriptionChange = (e) => {
        setDescription(e.target.value);
        setDescError(false);
    }
    const priceChange = (e) => {
        setPrice(e.target.value);
        setPriceError(false);
    }
    const brandChange = (e) => {
        setBrand(e.target.value);
        setBrandError(false);
    }
    const stockChange = (e) => {
        setStock(e.target.value);
        setStockError(false);
    }
    const filterChange = (e) => {
        setFilter(e.target.value);
        getRowData('https://dummyjson.com/products/search?q='+e.target.value);
    }

    const formValidation =() =>{
        if(title === "") {
            setTitleError(true);
        } else {
            setTitleError(false);
        }
        if(description === "") {
            setDescError(true);
        } else {
            setDescError(false);
        }
        if(price === ""){
            setPriceError(true);
        } else {
            setPriceError(false);
        }
        if(brand === ""){
            setBrandError(true);
        } else {
            setBrandError(false);
        }
        if(stock === ""){
            setStockError(true);
        } else {
            setStockError(false);
        }      
    }
    const editProductClick = () => {
        formValidation();
        if (title !== "" && description !== "" && price !== "" && brand !== "" && stock !== "") {
            setLoading(true);
            rowData.map((row) =>{
                selectedRows.map((selectedRow,index) => {
                    if(row.id === selectedRow.id)   { 
                        editProduct('https://dummyjson.com/products/'+row.id,{title: title, description: description, price: price, brand : brand, stock:stock},index,selectedRows);
                    }
                });
            });
        }
    }
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const addProductClick =() => {
        formValidation();
        if (title !== "" && description !== "" && price !== "" && brand !== "" && stock !== "") {
            setLoading(true);
            delay(1000).then(()=>{
                addProduct('https://dummyjson.com/products/add',{title: title, description: description, price: price, brand : brand, stock:stock});
            });
        }
    }

    const resetClick = (flag) =>{
        if(flag === 'filter') 
            getRowData('https://dummyjson.com/products/');
        setFilter('');
        addBtnClick(false);
        resetSelectedRowData();
    }

    const deleteClick = () => {
        showDialog(true); 
    }

    const yesClicked =() =>{
        setLoading(true);
        selectedRows.map((selectedRow) =>{
            deleteProduct('https://dummyjson.com/products/'+selectedRow.id);
        }); 
    }
    const refreshRowData =() =>{
    /*  rowData.map((row) =>{
    selectedRows.map((selectedRow) =>{
    if(row.id === selectedRow.id) { 
    if (title !== '' ) row.title = title;
    if (description !== '') row.description = description;
    if (price !== '') row.price = price;
    if (brand !== '') row.brand = brand;
    if (stock !== '' ) row.stock = stock;
    }
    });
    }); */

        let toastMsg='';
        if( updatedRowData.length > 0 && selectedRows.length === updatedRowData.length) {             /*  UPDATE PRODUCT  */
            toastMsg = updatedRowData.length+' row/s updated successfully ! ';
            setSelectedRows([]);
        }              

        if(addedRowData !== null)                                                                     /*  ADD PRODUCT  */
            toastMsg = 'New product added successfully ! ';

        if ( deletedRowData.length > 0 && selectedRows.length === deletedRowData.length) {            /*  DELETE PRODUCT  */
            toastMsg = deletedRowData.length+' row/s deleted successfully ! ';
        //  let newRowData = rowData.filter(row => ! deletedRowData.find(deleteRow => (deleteRow.id === row.id)) );     // Remove deleted row items from the rowData array
        //   rowData.splice(0);
        //   newRowData.map((row) => {
        //    rowData.push(row);  
        //   });
            setSelectedRows([]);
        // toParent();
        }
        if(toastMsg !== ''){
            resetSelectedRowData();
            setLoading(false);
            toast.info(toastMsg, {
                position: 'top-center',
                autoClose: false,
                onClose: () =>{
                setTitle('');
                setDescription('');
                setPrice('');
                setBrand('');
                setStock('');
                }
            });
        }

    }

    return (
    <>
    {
        dialog && 
        <YesNoDialog title='Delete Product' content='Are you sure you want to to delete the listed product/s ?' showDialog={showDialog} yesClicked={yesClicked}/>
    }
    <ToastContainer />
    <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...selectedRows.length > 0 && {
            bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            },
        }} 
        style={{ justifyContent: 'space-between' }}
    >
    {selectedRows.length > 0 || addFlag ? (
        <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
        ></Typography>
        ) : (
        <>
        <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            Products
        </Typography>
        <Typography
            color="inherit"
            variant="subtitle1"
            component="span"
        >
            Search By :
            &nbsp;
            <span>
            <TextField id="standard-basic" label="" variant="standard" value={ filter } onInput={ filterChange } style={{ marginTop:'0px', }}/>
            <Tooltip title="Clear">
                <IconButton onClick={ () => { resetClick('filter')  }}>
                <ClearIcon />
                </IconButton>
            </Tooltip>
            </span>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Button  startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => { addBtnClick(true); resetErrors(); }}>Add New Product</Button>
        </Typography>
        </>
    )}

    {
        (updatedRowData.length > 0 || deletedRowData.length > 0 || addedRowData !== null) && (
        <>
        { 
            refreshRowData() 
        }
        </>
        )
    }
    { 
        (loading && selectedRows.length !== updatedRowData.length) && (
        //  <span><CircularProgress size='25px'/>&nbsp; <label>Updating ...</label></span> 
        //  <span><SpinnerIcon width='25' height='25'/>&nbsp; <label>Updating ...</label></span>
        <></>
        )
    }
    <>
    {
        selectedRows.length > 0 || addFlag ? (
         
        <TableContainer style= {{ marginLeft:-25+'px'}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <div>
                                <TextField id="standard-basic" label= { addFlag ? "Add Title":"Edit Title"} variant="standard" value={ title } onChange={ titleChange }  style={{ width:'175px', }} />  
                            </div>
                            {
                                titleError && (
                                    <div style={{ marginTop:'5px'}}>
                                        <span style={{ color: "red" }}>Title cannot be empty</span>
                                    </div> )
                            }
                        </TableCell>
                        <TableCell>
                            <div>
                                <TextField id="standard-basic" label= { addFlag ? "Add description":"Edit description"} variant="standard" value={ description } onChange={ descriptionChange }  style={{ width:'300px', }}  />
                            </div>
                            {
                                descError && (
                                    <div style={{ marginTop:'5px'}}>
                                        <span style={{ color: "red" }}>Description cannot be empty</span>
                                    </div> )
                            }
                        </TableCell>
                        <TableCell>
                            <div>
                                <TextField id="standard-basic" label= { addFlag ? "Add Price":"Edit Price"} variant="standard" value={ price } onChange={ priceChange } style={{ width:'175px', }} />
                            </div>
                            {
                                priceError && (
                                    <div style={{ marginTop:'5px'}}>
                                        <span style={{ color: "red" }}>Price cannot be empty</span>
                                    </div> )
                            }
                        </TableCell>
                        <TableCell>
                            <div>
                                <TextField id="standard-basic" label= { addFlag ? "Add Brand":"Edit Brand"} variant="standard" value={ brand } onChange={ brandChange } style={{ width:'250px', }} />
                            </div>
                            {
                                brandError && (
                                    <div style={{ marginTop:'5px'}}>
                                        <span style={{ color: "red" }}>Brand cannot be empty</span>
                                    </div> )
                            }
                        </TableCell>
                        <TableCell>
                            <div>
                                <TextField id="standard-basic" label= { addFlag ? "Add Stock":"Edit Stock"} variant="standard" value={ stock } onChange={ stockChange } style={{ width:'105px', }} /> 
                            </div>
                            {
                                stockError && (
                                    <div style={{ marginTop:'5px'}}>
                                        <span style={{ color: "red" }}>Stock cannot be empty</span>
                                    </div> )
                            }  
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
        
        ):
        (
        <Tooltip title="Filter list">
        <IconButton>
        <FilterListIcon />
        </IconButton>
        </Tooltip>
        )   
    }
    </>
    {   
        selectedRows.length > 0 ? (       // EDIT MODE
        <>
        <Tooltip title="Edit">
            <IconButton onClick={ () => { editProductClick()  }} style={{  marginTop:'5px' }}>
            <EditIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
            <IconButton onClick={ () => { deleteClick()  }} style={{  marginTop:'5px' }}>
            <DeleteIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
            <IconButton onClick={ () => {  setSelectedRows([]); setTitle(''); setDescription('');  setPrice(''); setBrand(''); setStock(''); resetErrors();}}>
            <ClearIcon />
            </IconButton>
        </Tooltip> 
        </>
        ) : (<></>)
    } 
    {   
        addFlag && selectedRows.length === 0 ? (        // ADD MODE
        <>
        <Tooltip title="Add">
            <IconButton onClick={ () => { addProductClick()  }} style={{  marginTop:'5px' }}>
            <AddIcon />
            </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
            <IconButton onClick={ () => { resetClick('add'); setTitle(''); setDescription('');  setPrice(''); setBrand(''); setStock(''); resetErrors();  }}>
            <ClearIcon />
            </IconButton>
        </Tooltip> 
        </>
        ) : (<></>)
    } 
    {
        loading && updatedRowData.length > 0 ?  (
            // <span style = {{ marginTop:-15+'px',marginLeft:10+'px'}}><SpinnerIcon width='25' height='25'/></span> )
            <SpinnerDialog title='Updating Product/s ...'/> ) :
        loading && deletedRowData.length > 0 ? (
            <SpinnerDialog title='Deleting Product/s ...'/> ) :
        loading && addFlag ? (
            <SpinnerDialog title='Adding Product ...'/> ):<></>
    }
    </Toolbar>
    </>  
    );
}
export default EnhancedTableToolbar;
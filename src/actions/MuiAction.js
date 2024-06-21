import axios from "axios";
import { toast } from 'react-toastify';
export const GET_ROW_DATA = 'GET_ROW_DATA';
export const UPDATE_ROW_DATA = 'UPDATE_ROW_DATA';
export const DELETE_ROW_DATA = 'DELETE_ROW_DATA';
export const ADDED_ROW_DATA = 'ADDED_ROW_DATA';
export const RESET_ROW_DATA = 'RESET_ROW_DATA';
export const LOADING = 'LOADING';
export const ADD_BTN_CLICK = 'ADD_BTN_CLICK';
export const SHOW_DIALOG = 'SHOW_DIALOG';
export const SET_TITLE = 'SET_TITLE';
export const SET_DESCRIPTION = 'SET_DESCRIPTION';
export const SET_PRICE = 'SET_PRICE';
export const SET_BRAND = 'SET_BRAND';
export const SET_STOCK = 'SET_STOCK';

export const getRowData = (url) => {
  return async (dispatch) => {
    let payload = [];
   try {
        const { data: response } = await axios.get(url);
        payload = response.products;
    } catch (e) {
       console.log(e);
    }
    dispatch({
        type: GET_ROW_DATA,
        rowData: payload
    });
  };
};

export const editProduct = (url,data,index,selectedRows) => {
  return async (dispatch) => {
  let payload=null;
    try {
          const { data: response } = await axios.put(url,data);
          payload=response;  
          dispatch({
            type: UPDATE_ROW_DATA,
            rowData: payload
          });   
        } catch (e) {
          if(selectedRows.length === index+1) {
            toast.error('Unable to update Product data ! Please try again later.', {
              position: 'top-center',
              autoClose: 2000,
              onClose: () =>{
                dispatch({
                  type: LOADING,
                  loading:false
              });
              }
            });
          }
         //  window.location.reload(false);
        }
    };
};

export const addProduct = (url,data) => {
  return async (dispatch) => {
  let payload=null;
    try {
          const { data: response } = await axios.post(url,data);
          payload=response;  
          dispatch({
            type: ADDED_ROW_DATA,
            rowData: payload
          });   
        } catch (e) {
            toast.error('Unable to add Product data ! Please try again later.', {
              position: 'top-center',
              autoClose: 2000,
              onClose: () =>{
                dispatch({
                  type: LOADING,
                  loading:false
              });
              }
            });
        }
    };
};

export const deleteProduct = (url) => {
  return async (dispatch,getState) => {
    let payload=null;
    try {
         // const {rowData} = getState().muiReducer; 
          const { data: response } = await axios.delete(url);
          payload=response; 
          dispatch({
            type: DELETE_ROW_DATA,
            rowData: payload
          }); 
        } catch (e) {
            toast.error('Unable to delete Product data ! Please try again later.', {
              position: 'top-center',
              autoClose: 2000,
              onClose: () =>{
                dispatch({
                  type: LOADING,
                  loading:false
              });
              }
            });
        }
  };
};

export const filterProducts = (url) => {
  return async (dispatch) => {
  let payload=null;
    try {
          const { data: response } = await axios.get(url);
          payload=response;  
          dispatch({
            type: UPDATE_ROW_DATA,
            rowData: payload
          });   
        } catch (e) {}
    };
};

export const resetSelectedRowData = () =>{
  return (dispatch) =>{
    dispatch({
      type: RESET_ROW_DATA,
  });
  }
};

export const setLoading = (loading) =>{
  return (dispatch) =>{
    dispatch({
      type: LOADING,
      loading:loading
  });
  }
};

export const addBtnClick = (flag) =>{
    return (dispatch) => {
      dispatch({
        type:ADD_BTN_CLICK,
        flag:flag
      });
    }
};

export const showDialog = (flag) =>{
  return (dispatch) =>{
    dispatch({
      type: SHOW_DIALOG,
      dialog:flag
  });
  }
};

export const setTitle = (title) =>{
  return (dispatch) =>{
    dispatch({
      type: SET_TITLE,
      title:title
  });
  }
};

export const setDescription = (description) =>{
  return (dispatch) =>{
    dispatch({
      type: SET_DESCRIPTION,
      description:description
  });
  }
};
export const setPrice = (price) =>{
  return (dispatch) =>{
    dispatch({
      type: SET_PRICE,
      price:price
  });
  }
};
export const setBrand = (brand) =>{
  return (dispatch) =>{
    dispatch({
      type: SET_BRAND,
      brand:brand
  });
  }
};
export const setStock = (stock) =>{
  return (dispatch) =>{
    dispatch({
      type: SET_STOCK,
      stock:stock
  });
  }
};







  

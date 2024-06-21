const INITIAL_STATE = {
    rowData: [],
    updatedRowData:[],
    loading: false,
    addFlag: false,
    addedRowData:null,
    deletedRowData:[],
    dialog: false,
    title:'',
    description:'',
    price:'',
    brand:'',
    stock:''
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "GET_ROW_DATA":
        return {
          ...state,
          rowData: action.rowData,
        };

      case "ADDED_ROW_DATA":
        return {
          ...state,
          addedRowData: action.rowData,
          rowData: [action.rowData,...state.rowData]
        };
        
      case "UPDATE_ROW_DATA":
        return {
          ...state,
          updatedRowData: [action.rowData,...state.updatedRowData],
          rowData : state.rowData.map(row => row.id === action.rowData.id ? action.rowData  : row)
        };

      case "DELETE_ROW_DATA":
        return {
        ...state,
        deletedRowData: [action.rowData,...state.deletedRowData],
        rowData : state.rowData.filter(row => row.id !== action.rowData.id )
      };

      case "RESET_ROW_DATA":
        return {
          ...state,
          updatedRowData:[],
          addedRowData:null,
          deletedRowData:[]
        };

      case "LOADING":
        return {
          ...state,
          loading:action.loading
        };

      case "ADD_BTN_CLICK":
        return {
          ...state,
          addFlag:action.flag
        };

      case "SHOW_DIALOG":
        return {
          ...state,
          dialog:action.dialog
        };

      case "SET_TITLE":
        return {
          ...state,
          title:action.title
        };
      case "SET_DESCRIPTION":
        return {
          ...state,
          description:action.description
      };
      case "SET_PRICE":
        return {
          ...state,
          price:action.price
      };
      case "SET_BRAND":
        return {
          ...state,
          brand:action.brand
      };
      case "SET_STOCK":
        return {
          ...state,
          stock:action.stock
      };
     
      default:
        return state;
    }
  }
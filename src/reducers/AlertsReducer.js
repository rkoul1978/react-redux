const INITIAL_STATE = {
    countryData: [],
    productData:[],
    isLoading: false,
    isError: false,
    errorMsg: ""
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "REQUEST_COUNTRY_DATA":
        return {
          ...state,
          countryData: action.countryData,
          isLoading: false,
          isError: action.isError,
          errorMsg: action.errorMsg
        };
      case "REQUEST_PRODUCT_DATA":
        return {
          ...state,
          productData: action.productData,
        };
      default:
        return state;
    }
  }

 
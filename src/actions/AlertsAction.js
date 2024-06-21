import { REQUEST_COUNTRY_DATA, REQUEST_PRODUCT_DATA } from './types';
import axios from "axios";

export const requestCountries = (url) => {
  return async (dispatch) => {
   let payload = [];
   try {
      const json = await axios.get(url);
      payload = json.data;
    } catch (e) {}
    dispatch({
      type: REQUEST_COUNTRY_DATA,
      countryData: payload,
      isError: false,
      errorMsg: ""
    });
  };
}

export const requestProducts = (url) => {
  return async (dispatch) => {
   let payload = [];
   try {
      const json = await axios.get(url);
      payload = json.data.products;
    } catch (e) {}
    dispatch({
      type: REQUEST_PRODUCT_DATA,
      productData: payload,
    });
  };
}

  

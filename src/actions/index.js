import { REQUEST_USERS_DATA } from './types';
import { RECEIVE_USERS_DATA } from './types';
import axios from "axios";

/*export function fetchCountries(match) {
  return async function (dispatch) {
    const response = await fetch('https://restcountries.com/v3.1/name/'+match, { method: 'GET', body:  null });
    if (response){
      dispatch({
        type: REQUEST_COUNTRY_DATA,
        payload: response.json()
      }) 
    }
  }
}*/

export function requestUsers(url) {
  return async function(dispatch){
    dispatch({
      type: REQUEST_USERS_DATA
    });
    try {
      const json = await axios.get(url);
      dispatch({
        type: RECEIVE_USERS_DATA,
        usersData: json.data,
        isError: false,
        errorMsg: ""
      });
    } catch (e) {
      dispatch({
        type: RECEIVE_USERS_DATA,
        usersData: [],
        isError: true,
        errorMsg: e.response.status
      });
      console.log(e);
    }
  }
}


  

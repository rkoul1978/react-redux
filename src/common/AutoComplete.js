import React, { useState,useRef,useCallback  } from 'react';
import { Select} from '@material-ui/core/Select';
import { debounce } from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const AutoComplete = (props) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const autoC = useRef(null);
    props.resetCallback(autoC);
    return(
        <Autocomplete
            ref={autoC}
            id="ac"
            options={props.loadData}
            renderInput={params => (
                <TextField {...params} label="Type to Search" size="small"/>
            )}
            getOptionLabel={(option) =>{
                if (props.data === 'countries')
                  return option.name.common +' ('+option.cca2+')';
                else if (props.data === 'products')  
                  return option.title;
                else if (props.data === 'templates')  
                  return option.name +' ('+option.id+')';
            }}
            style={{ width: 300, marginTop: -10 }}
            value={selectedValue}
            onChange={(_event, newValue) => {
              setSelectedValue(newValue);
              props.selectedCallback(newValue);
            }}
        />
    );
};
export default AutoComplete;



 /*const AutoComplete = ({autoCompleteCallback}) =>{

 let lastFetchId = 0;
 const [data, setData] = useState([]);
 const [value, setValue] = useState(null);
 const [fetching, setFetching] = useState(false);

 const fetchUser = useCallback(
  debounce((v) => {
    if( v !== ''){
      lastFetchId +=1;
      const fetchId = lastFetchId;
      setData([]);
      setFetching(true);
      try {
        axios.get("https://randomuser.me/api/?results="+v)
        .then(res => {
          if(fetchId !== lastFetchId){  
            // for fetch callback order
            return
          }
          const d = res.data.results.map((element) => ({
            value: element.name.first + ' ' +element.name.last
          }));
          setData(d);
          setFetching(false);
        });
      } catch (e) {
        setFetching(false);
      }
    } else {
      setValue(null);
      autoCompleteCallback('');
    }
  },500),
 []);

 const handleChange =(v) => {
    setValue(v);
    setData([]);
    setFetching(false);
    autoCompleteCallback(v);
 };
 return (
  <Select
      showSearch
      highlightOption
      value={value}
      placeholder="None"
      loading={fetching}
      customizeFilter={false}
      onSearch={fetchUser}
      onChange={handleChange}
  >
    {data.map( d =>(
      <Option key={d.value}>{d.value}</Option>
    ))}
  </Select>
 );
}*/


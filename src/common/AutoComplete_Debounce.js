import React, { useState,useRef,useCallback  } from 'react';
import { debounce } from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const AutoCompleteDebounce = (props) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const debouncedLoadData = useCallback(
        debounce((inputValue) => {
            if( inputValue !== ''){
              setLoading(true);
              try {
                axios.get("https://randomuser.me/api/?results="+inputValue)
                .then(res => {
                  const d = res.data.results.map((element) => ({
                    value: element.name.first + ' ' +element.name.last
                  }));
                  (async () => {
                    await new Promise(resolve =>
                      setTimeout(() => {
                        setOptions(d);
                        setLoading(false);
                        resolve()
                      }, 2000)
                    )
                  })();
                });
              } catch (e) {
                setLoading(false);
              }
            } else {
              setOptions([]);
            }
          },500),
         []);
   
    return(
        <Autocomplete
            id="ac"
            options={options}
            loading={loading}
            highlightOption
            renderInput={params => (
                <TextField {...params} label="Search Name" onChange={(e) => {
                      setOptions([]);
                      debouncedLoadData(e.target.value);
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }} 
                    variant='outlined'
                />
            )}
            getOptionLabel={(option) =>{
                if (props.data === 'names')
                  return option.value;
            }}
            style={{ width: 300, marginTop: -10 }}
            value={selectedValue}
            onChange={(_event, newValue) => {
              setSelectedValue(newValue);
              props.selectedCallback(newValue);
            }}
            filterOptions={(x) => x}
            noOptionsText="No Names"
        />
    );
};
export default AutoCompleteDebounce;

